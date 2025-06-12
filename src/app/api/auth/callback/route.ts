// src/app/api/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { createSSRSassClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from '@/lib/email/send';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        const supabase = await createSSRSassClient()
        const client = supabase.getSupabaseClient()

        // Exchange the code for a session
        await supabase.exchangeCodeForSession(code)

        // Get the current user
        const { data: { user }, error: userError } = await client.auth.getUser();
        
        if (userError || !user) {
            console.error('Error getting user after callback:', userError);
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        // Check if this is a new user (first time email verification)
        // We'll check if user_profiles record exists
        const { data: profile, error: profileError } = await client
            .from('user_profiles')
            .select('user_id, email_notifications, welcome_email_sent, display_name')
            .eq('user_id', user.id)
            .maybeSingle();

        // If profile doesn't exist, this is a new user
        const isNewUser = !profile;
        const emailNotSent = profile && typeof profile === 'object' && 'welcome_email_sent' in profile 
            ? (profile as any).welcome_email_sent !== true 
            : true;

        if ((isNewUser || emailNotSent) && user.email) {
            try {
                // Send welcome email
                const firstName = (profile && typeof profile === 'object' && 'display_name' in profile) 
                    ? (profile as any).display_name as string || user.email.split('@')[0]
                    : user.email.split('@')[0];
                await sendWelcomeEmail(user.email, firstName);

                // Update profile to mark welcome email as sent
                if (isNewUser) {
                    await client
                        .from('user_profiles')
                        .insert({
                            user_id: user.id,
                            display_name: firstName,
                            welcome_email_sent: true,
                            updated_at: new Date().toISOString()
                        });
                } else {
                    await client
                        .from('user_profiles')
                        .update({
                            welcome_email_sent: true,
                            updated_at: new Date().toISOString()
                        })
                        .eq('user_id', user.id);
                }

                console.log(`[AUTH_CALLBACK] Welcome email sent to ${user.email}`);
            } catch (emailError) {
                console.error('[AUTH_CALLBACK] Failed to send welcome email:', emailError);
                // Don't fail the auth flow if email fails
            }
        }

        // Check MFA status
        const { data: aal, error: aalError } = await client.auth.mfa.getAuthenticatorAssuranceLevel()

        if (aalError) {
            console.error('Error checking MFA status:', aalError)
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }

        // If user needs to complete MFA verification
        if (aal.nextLevel === 'aal2' && aal.nextLevel !== aal.currentLevel) {
            return NextResponse.redirect(new URL('/auth/2fa', request.url))
        }

        // If MFA is not required or already verified, proceed to app
        return NextResponse.redirect(new URL('/app', request.url))
    }

    // If no code provided, redirect to login
    return NextResponse.redirect(new URL('/auth/login', request.url))
}