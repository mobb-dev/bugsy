import readline from 'node:readline'

export async function keypress() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question('', (answer) => {
      rl.close()
      process.stderr.moveCursor(0, -1)
      process.stderr.clearLine(1)
      resolve(answer)
    })
  })
}
