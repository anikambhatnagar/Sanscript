import parse from "./parser.js"
try {
    parse("likhana(1)")
    console.log("Syntax is ok")

}
catch (e) {
    console.log("\x1b[31m%s\x1b[0m" , e.message);
    process.exit(1)
}



