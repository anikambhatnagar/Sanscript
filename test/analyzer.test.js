
import assert from "node:assert/strict"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"

// Programs that are semantically correct
const semanticChecks = [
  ["hello world", `likhana("नमस्ते दुनिया");`],
  ["variable declarations", "sankhya var1 = 15;"],
  ["while statement", "jabtaki (5) { likhana 2; }"],
  [
    "while statement with variable",
    "sankhya x = 15; jabtaki (x < 25) { likhana x + 2; x = x + 1; }",
  ],
  ["function declaration", "prakriya doubleIt(x) { laana x * 2; }"],
  ["long return", "prakriya f() { laana saty; }"],
  ["short if", "agar (1<3) {likhana 3;}"],
  ["if else", "agar (1<3) {likhana 3;} varana {likhana 4;}"],
  ["long if", "agar (1<3) {likhana 3;} varana agar (1>3) {likhana 2;} varana {likhana 1;}"]
]

const semanticErrors = [
  ["undeclared id", "likhana(x);", /Identifier x not declared/],
  ["return type mismatch", "prakriya f() { laana asaty; }"]   // dont have types yet, so this causes an error
]

describe("The analyzer", () => {
  for (const [scenario, source] of semanticChecks) {
    it(`recognizes ${scenario}`, () => {
      assert.ok(analyze(parse(source)))
    })
  }
  for (const [scenario, source, errorMessagePattern] of semanticErrors) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => analyze(parse(source)), errorMessagePattern)
    })
  }
})