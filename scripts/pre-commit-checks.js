#!/usr/bin/env node

// Pre-commit checks to prevent common errors from returning
const fs = require('fs');
const path = require('path');

const ERRORS = [];

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Check for hydration mismatch patterns
function checkHydrationIssues() {
  log('blue', '🔍 Checking for potential hydration issues...');
  
  const componentsDir = path.join(process.cwd(), 'src/components');
  const files = getAllTsxFiles(componentsDir);
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for dynamic content without suppressHydrationWarning
    const dynamicPatterns = [
      /Date\.now\(\)/g,
      /Math\.random\(\)/g,
      /new Date\(\)/g,
      /window\./g,
      /localStorage\./g,
      /sessionStorage\./g
    ];
    
    dynamicPatterns.forEach(pattern => {
      if (pattern.test(content) && !content.includes('suppressHydrationWarning')) {
        ERRORS.push({
          type: 'HYDRATION_RISK',
          file: file,
          message: `Dynamic content detected without suppressHydrationWarning`
        });
      }
    });
    
    // Check for conditional rendering without proper client-side detection
    if (content.includes('typeof window') && !content.includes('useEffect')) {
      ERRORS.push({
        type: 'HYDRATION_RISK',
        file: file,
        message: `Client-side check without useEffect - potential hydration mismatch`
      });
    }
  });
}

// Check for realtime subscription issues
function checkRealtimeIssues() {
  log('blue', '🔍 Checking for realtime subscription issues...');
  
  const hooksDir = path.join(process.cwd(), 'src/lib/hooks');
  const files = getAllTsFiles(hooksDir);
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for direct Supabase subscription without manager
    if (content.includes('.on(') && content.includes('postgres_changes')) {
      if (!content.includes('realtime-manager')) {
        ERRORS.push({
          type: 'REALTIME_RISK',
          file: file,
          message: `Direct Supabase subscription - use RealtimeManager instead`
        });
      }
    }
    
    // Check for missing unique subscription IDs
    if (content.includes('realtimeManager.subscribe') && !content.includes('Math.random()')) {
      ERRORS.push({
        type: 'REALTIME_RISK',
        file: file,
        message: `Subscription ID not unique - add Math.random() for uniqueness`
      });
    }
    
    // Check for missing error handling
    if (content.includes('realtimeManager.subscribe') && !content.includes('.catch(')) {
      ERRORS.push({
        type: 'REALTIME_RISK',
        file: file,
        message: `Missing error handling for realtime subscription`
      });
    }
  });
}

// Check Next.js configuration
function checkNextConfig() {
  log('blue', '🔍 Checking Next.js configuration...');
  
  const configPath = path.join(process.cwd(), 'next.config.ts');
  if (!fs.existsSync(configPath)) return;
  
  const content = fs.readFileSync(configPath, 'utf8');
  
  // Check for HTTP 431 prevention
  if (!content.includes('eval-cheap-module-source-map')) {
    ERRORS.push({
      type: 'CONFIG_RISK',
      file: configPath,
      message: `Missing dev mode source map optimization - can cause HTTP 431 errors`
    });
  }
  
  // Check for tree shaking conflicts
  if (content.includes('usedExports: true') && content.includes('Next.js 15')) {
    ERRORS.push({
      type: 'CONFIG_RISK',
      file: configPath,
      message: `usedExports conflicts with Next.js 15 caching - remove manual setting`
    });
  }
  
  // Check for proper bundle splitting
  if (!content.includes('splitChunks')) {
    ERRORS.push({
      type: 'PERFORMANCE_RISK',
      file: configPath,
      message: `Missing bundle splitting configuration`
    });
  }
}

// Check for performance issues
function checkPerformanceIssues() {
  log('blue', '🔍 Checking for performance issues...');
  
  const appDir = path.join(process.cwd(), 'src/app');
  const files = getAllTsxFiles(appDir);
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for missing dynamic imports
    if (content.includes('import') && content.includes('ChatInterface|LessonContainer|AdminPanel')) {
      if (!content.includes('dynamic(') && !content.includes('lazy(')) {
        ERRORS.push({
          type: 'PERFORMANCE_RISK',
          file: file,
          message: `Heavy component should use dynamic import`
        });
      }
    }
    
    // Check for missing loading states
    if (file.includes('page.tsx') && !content.includes('loading') && !content.includes('Suspense')) {
      ERRORS.push({
        type: 'PERFORMANCE_RISK',
        file: file,
        message: `Page missing loading state or Suspense boundary`
      });
    }
  });
}

// Check package.json for problematic dependencies
function checkDependencies() {
  log('blue', '🔍 Checking dependencies...');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  const content = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Check for conflicting versions
  const problematicDeps = {
    'react': { min: '19.0.0', message: 'React version should be 19.x for Next.js 15' },
    'next': { min: '15.0.0', message: 'Next.js should be 15.x for latest features' },
    '@supabase/supabase-js': { min: '2.40.0', message: 'Supabase should be recent version' }
  };
  
  Object.entries(problematicDeps).forEach(([dep, { min, message }]) => {
    const version = content.dependencies?.[dep] || content.devDependencies?.[dep];
    if (version && !satisfiesVersion(version, min)) {
      ERRORS.push({
        type: 'DEPENDENCY_RISK',
        file: packagePath,
        message: `${dep}: ${message} (current: ${version})`
      });
    }
  });
}

// Utility functions
function getAllTsxFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return getAllFiles(dir).filter(file => file.endsWith('.tsx'));
}

function getAllTsFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return getAllFiles(dir).filter(file => file.endsWith('.ts') || file.endsWith('.tsx'));
}

function getAllFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(getAllFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  });
  
  return files;
}

function satisfiesVersion(current, min) {
  // Simple version comparison - in real project use semver package
  const currentClean = current.replace(/[^\d.]/g, '');
  const minClean = min.replace(/[^\d.]/g, '');
  return currentClean >= minClean;
}

// Main execution
function runChecks() {
  log('green', '🛡️ Running pre-commit error prevention checks...\n');
  
  checkHydrationIssues();
  checkRealtimeIssues();
  checkNextConfig();
  checkPerformanceIssues();
  checkDependencies();
  
  // Report results
  if (ERRORS.length === 0) {
    log('green', '✅ All checks passed! No potential issues detected.');
    process.exit(0);
  } else {
    log('red', `❌ Found ${ERRORS.length} potential issues:\n`);
    
    ERRORS.forEach((error, index) => {
      log('yellow', `${index + 1}. ${error.type}`);
      log('red', `   File: ${error.file}`);
      log('red', `   Issue: ${error.message}\n`);
    });
    
    log('yellow', '💡 Fix these issues before committing to prevent known errors from returning.');
    log('blue', '📚 Check docs/stage6-tasks.md for solutions to these common problems.');
    
    // Don't fail commit in development, just warn
    if (process.env.NODE_ENV === 'development') {
      log('yellow', '⚠️  Development mode: Proceeding despite warnings.');
      process.exit(0);
    } else {
      process.exit(1);
    }
  }
}

// Run if called directly
if (require.main === module) {
  runChecks();
}

module.exports = { runChecks }; 