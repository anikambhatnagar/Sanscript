import * as fs from "node:fs/promises"
import process from "node:process"
import util from "node:util"
import parse from "./parser.js"
import analyze from "./analyzer.js"

/*
try {
  const match = parse("print 1;")
  const rep = analyze(match)
  console.log(util.inspect(rep, {depth:5}))
} catch(e) {
  console.error("\x1b[31m%s\x1b[0m", e.message)
  process.exit(1)
}
*/
///*
if (process.argv.length !== 3) {
  console.log('Must have exactly one argument: the filename of the program to compile.')
} else {
  try {
    const buffer = await fs.readFile(process.argv[2])
    //added the below line:
    const match = parse(buffer.toString()) 
    const rep = analyze(match)
    console.log("Syntax ok")
  } catch (e) {
    console.error(`\u001b[31m${e}\u001b[39m`)
  }
}
//*/