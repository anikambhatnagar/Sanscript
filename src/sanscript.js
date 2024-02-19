<<<<<<< HEAD
import parse from "./parser.js"
try {
    parse("likhana(1)")
    console.log("Syntax is ok")

}
catch (e) {
    console.log("\x1b[31m%s\x1b[0m" , e.message);
    process.exit(1)
}



=======
import * as fs from "node:fs/promises"
import process from "node:process"
import parse from "./parser.js"

if (process.argv.length !== 3) {
  console.log('Must have exactly one argument: the filename of the program to compile.')
} else {
  try {
    const buffer = await fs.readFile(process.argv[2])
    parse(buffer.toString())
    console.log("Syntax ok")
  } catch (e) {
    console.error(`\u001b[31m${e}\u001b[39m`)
  }
}
>>>>>>> 3c9723fdeb2a56f0fc76e78bcd6c7a8a6a3fa92e
