import bcrypt from 'bcrypt'

const password = process.argv[2]
if (!password) {
  console.error('Usage: node generate-password-hash.js YOUR_PASSWORD')
  process.exit(1)
}

const saltRounds = 10
bcrypt.hash(password, saltRounds).then(hash => {
  console.log('Generated hash:', hash)
  console.log('\nAdd this to your .env file:')
  console.log(`ADMIN_PASSWORD_HASH='${hash}'`)
}) 

// node scripts/generate-password-hash.js "원하는_비밀번호"