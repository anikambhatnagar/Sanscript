import assert from "node:assert/strict"
import parse from "../src/parser.js"

// Programs expected to be syntactically correct
const syntaxChecks = [
  ["hello world", `likhana("hello world");`],
  ["multiple statements", "sankhya average = 1; likhana(average);"],
  ["variable declarations", "sankhya var1 = 15;"],
  ["parentheses", "likhana(83 * ((((((((-(13 / 21))))))))) + 1 - 0);"],
  ["if", "agar (4<9) {likhana(9);}"]
  //["longerif","agar (4<9) {likhana(9);}varana {likhana(8);}"]
  //["while","jabaki saty {var = var+1;}"]
]

// Programs with syntax errors that the parser will detect
const syntaxErrors = [
  ["non-letter in an identifier", "sankhya ab😭c = 2;", /Line 1, col 11:/],
]

describe("The parser", () => {
  for (const [scenario, source] of syntaxChecks) {
    it(`matches ${scenario}`, () => {
      assert(parse(source).succeeded())
    })
  }
  for (const [scenario, source, errorMessagePattern] of syntaxErrors) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => parse(source), errorMessagePattern)
    })
  }
})
