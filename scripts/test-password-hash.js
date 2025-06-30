import bcrypt from 'bcrypt'

const password = "admin123"
const storedHash = '$2b$10$/xYhAPinJ98IcslT62zri.JWudadrWyxJbN7JTkFYOtYKxLEcZtqe'

console.log('Test 1: 새로운 해시 생성')
const saltRounds = 10
bcrypt.hash(password, saltRounds).then(newHash => {
  console.log('New hash:', newHash)
  console.log('Stored hash:', storedHash)
  console.log('Hash length check:', newHash.length === storedHash.length)
})

console.log('\nTest 2: 저장된 해시로 비밀번호 검증')
bcrypt.compare(password, storedHash).then(isValid => {
  console.log('Password validation result:', isValid)
  console.log('Raw comparison:', password, storedHash)
})

// 추가 테스트: 해시에 작은따옴표가 포함된 경우를 확인
const hashWithQuotes = storedHash.replace(/'/g, '')
console.log('\nTest 3: 따옴표 제거 후 검증')
bcrypt.compare(password, hashWithQuotes).then(isValid => {
  console.log('Password validation without quotes:', isValid)
}) 