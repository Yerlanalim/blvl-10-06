import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { updateSession } from '@/lib/supabase/middleware'
import { getTierConfig } from '@/lib/tiers/config'
import { TierType } from '@/lib/types'

// Cache for level access results to avoid repeated DB queries
const levelAccessCache = new Map<string, { 
  canAccess: boolean; 
  timestamp: number; 
  ttl: number;
}>();

// Cache TTL: 5 minutes
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Check if user can access a lesson level
 */
async function checkLessonAccess(
  request: NextRequest,
  userId: string,
  levelId: number
): Promise<boolean> {
  const cacheKey = `${userId}-${levelId}`;
  const cached = levelAccessCache.get(cacheKey);
  
  // Return cached result if valid
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.canAccess;
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll() {
            // No-op for middleware
          },
        },
      }
    )

    // Get user profile for tier and progress info
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('current_level, tier_type, completed_lessons')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      // Cache negative result for shorter period
      levelAccessCache.set(cacheKey, {
        canAccess: false,
        timestamp: Date.now(),
        ttl: 30 * 1000 // 30 seconds for errors
      });
      return false;
    }

    const { current_level, tier_type, completed_lessons } = profile;
    const tierConfig = getTierConfig(tier_type as TierType);

    // Check tier restrictions first
    if (levelId > tierConfig.maxLevels) {
      levelAccessCache.set(cacheKey, {
        canAccess: false,
        timestamp: Date.now(),
        ttl: CACHE_TTL
      });
      return false;
    }

    // Check if level is completed (always accessible)
    const isCompleted = completed_lessons?.includes(levelId) || false;
    if (isCompleted) {
      levelAccessCache.set(cacheKey, {
        canAccess: true,
        timestamp: Date.now(),
        ttl: CACHE_TTL
      });
      return true;
    }

    // Check progression - user can access current level and below
    const canAccess = levelId <= current_level;
    
    levelAccessCache.set(cacheKey, {
      canAccess,
      timestamp: Date.now(),
      ttl: CACHE_TTL
    });

    return canAccess;

  } catch (error) {
    console.error('Middleware: Error checking lesson access:', error);
    // Cache negative result for shorter period on errors
    levelAccessCache.set(cacheKey, {
      canAccess: false,
      timestamp: Date.now(),
      ttl: 30 * 1000
    });
    return false;
  }
}

/**
 * Clean up expired cache entries
 */
function cleanupCache() {
  const now = Date.now();
  for (const [key, value] of levelAccessCache.entries()) {
    if (now - value.timestamp >= value.ttl) {
      levelAccessCache.delete(key);
    }
  }
}

export async function middleware(request: NextRequest) {
  // Clean up cache periodically
  if (Math.random() < 0.01) { // 1% chance to cleanup
    cleanupCache();
  }

  // Handle lesson and level access protection
  if (request.nextUrl.pathname.startsWith('/app/lesson/') || request.nextUrl.pathname.startsWith('/app/level/')) {
    // Extract level ID from URL
    const pathSegments = request.nextUrl.pathname.split('/');
    const levelIdStr = pathSegments[3]; // /app/lesson/[id] or /app/level/[id]
    const levelId = parseInt(levelIdStr);

    if (!isNaN(levelId)) {
      // First run the standard auth middleware
      const sessionResponse = await updateSession(request);
      
      // Check if user was redirected (not authenticated)
      if (sessionResponse.headers.get('location')) {
        return sessionResponse; // Let auth redirect happen
      }

      // Get user from the session response
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return sessionResponse.cookies.getAll()
            },
            setAll() {
              // No-op for middleware
            },
          },
        }
      );

      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Check lesson access for authenticated user
        const hasAccess = await checkLessonAccess(request, user.id, levelId);
        
        if (!hasAccess) {
          // Log unauthorized access attempt
          console.warn(`Unauthorized lesson access attempt: User ${user.id} tried to access level ${levelId}`);
          
          // Redirect to levels page with error message
          const url = request.nextUrl.clone();
          url.pathname = '/app/levels';
          url.searchParams.set('error', 'access_denied');
          url.searchParams.set('level', levelId.toString());
          
          return NextResponse.redirect(url);
        }
      }

      return sessionResponse;
    }
  }

  // For all other routes, use standard session handling
  return await updateSession(request)
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}