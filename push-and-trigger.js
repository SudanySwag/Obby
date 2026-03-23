#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔄 Pushing changes and triggering morning briefing...');

try {
    // Push changes
    execSync('git push origin main', { stdio: 'inherit' });
    console.log('✅ Changes pushed successfully');

    // Trigger morning briefing
    execSync(`curl -X GET "https://obby-six.vercel.app/api/morning-briefing" -H "Content-Type: application/json"`, { stdio: 'inherit' });
    console.log('✅ Morning briefing triggered');

} catch (error) {
    console.error('❌ Operation failed:', error.message);
    process.exit(1);
}