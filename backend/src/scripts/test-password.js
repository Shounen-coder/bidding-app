const PasswordUtils = require('../utils/passwordUtils');

async function testPasswordHashing() {
  console.log('🔐 Testing Password Hashing System...\n');

  const testPasswords = [
    'simplepass',           // Weak
    'Password123',          // Medium
    'MySecure!Pass2024',   // Strong
    'P@ssw0rd123!Strong'   // Very Strong
  ];

  for (const password of testPasswords) {
    console.log(`Testing password: "${password}"`);
    
    // Check strength
    const validation = PasswordUtils.validatePasswordStrength(password);
    console.log(`  Strength: ${validation.strength.level} (score: ${validation.strength.score})`);
    console.log(`  Valid: ${validation.isValid}`);
    
    if (!validation.isValid) {
      console.log(`  Errors: ${validation.errors.join(', ')}`);
    } else {
      // Test hashing and verification
      try {
        const hashed = await PasswordUtils.hashPassword(password);
        console.log(`  Hashed: ${hashed.substring(0, 20)}...`);
        
        const isValid = await PasswordUtils.verifyPassword(password, hashed);
        console.log(`  Verification: ${isValid ? '✅ PASS' : '❌ FAIL'}`);
        
        // Test wrong password
        const wrongPassword = await PasswordUtils.verifyPassword('wrongpass', hashed);
        console.log(`  Wrong password: ${wrongPassword ? '❌ FAIL' : '✅ PASS'}`);
      } catch (error) {
        console.log(`  Error: ${error.message}`);
      }
    }
    console.log('');
  }
}

testPasswordHashing().catch(console.error);
