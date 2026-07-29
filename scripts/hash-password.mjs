import { pbkdf2Sync, randomBytes } from 'node:crypto'
import { stdin, stdout } from 'node:process'
import { createInterface } from 'node:readline/promises'

const readline = createInterface({ input: stdin, output: stdout })
const password = await readline.question('Введите пароль администратора: ')
readline.close()

if (password.length < 12) {
  throw new Error('Пароль должен содержать не менее 12 символов')
}

const iterations = 210_000
const salt = randomBytes(16)
const hash = pbkdf2Sync(password, salt, iterations, 32, 'sha256')

stdout.write(
  `$pbkdf2-sha256$${iterations}$${salt.toString('base64url')}$${hash.toString('base64url')}\n`,
)
