const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Starting build process...');

try {
  // Try to use NestJS CLI first
  console.log('📦 Attempting to use NestJS CLI...');
  execSync('nest build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully with NestJS CLI');
} catch (error) {
  console.log('⚠️ NestJS CLI failed, trying npx...');
  try {
    execSync('npx @nestjs/cli build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully with npx @nestjs/cli');
  } catch (error2) {
    console.log('⚠️ npx failed, using TypeScript compiler directly...');
    try {
      execSync('npx tsc', { stdio: 'inherit' });
      console.log('✅ Build completed successfully with TypeScript compiler');
    } catch (error3) {
      console.error('❌ All build methods failed');
      console.error('Error 1 (nest):', error.message);
      console.error('Error 2 (npx):', error2.message);
      console.error('Error 3 (tsc):', error3.message);
      process.exit(1);
    }
  }
}

console.log('🎉 Build process completed!'); 