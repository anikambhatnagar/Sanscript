import assert from "node:assert/strict"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"

// Programs that are semantically correct
const semanticChecks = [
  ["hello world", `likhana("नमस्ते दुनिया");`],
  ["variable declarations", "sankhya ginti var1 = 15;"],
  ["while statement", "jabtaki (5) { likhana 2; }"],
  [
    "while statement with variable",
    "sankhya ginti x = 15; jabtaki (x < 25) { likhana x + 2; x = x + 1; }",
  ],
  [
    "function declaration",
    "prakriya doubleIt(ginti x) : ginti { laana x * 2; }",
  ],
  [
    "function call",
    "prakriya even(ginti x) : babla { laana (x % 2 == 0); }",
    "ginti x = 4; likhana(even(x));",
  ],
  ["long return", "prakriya f() : babla { laana saty; }"],
  ["short if", "agar (1<3) {likhana 3;}"],
  ["if else", "agar (1<3) {likhana 3;} varana {likhana 4;}"],
  [
    "long if",
    "agar (1<3) {likhana 3;} varana agar (1>3) {likhana 2;} varana {likhana 1;}",
  ],
  ["power", "likhana(4**6);"],
  ["and operator", "sankhya ginti x = 4; likhana((x < 10) && (x>0));"],
  ["or operator", "sankhya ginti x = 4; likhana((x < 10) || (x>10));"],
  ["ternary", "sankhya ginti x = 5; sankhya ginti y = x > 10 ? 20 : 30;"],
  ["unary minus", "sankhya ginti x = 5; sankhya ginti y = 0-x;"],
  //["function call", "prakriya even(x) {laana (x % 2 == 0); } sankhya ginti x = 4; likhana(even(x));"],
  ["return type mismatch", "prakriya f() : babla { laana asaty; }"],
]

const semanticErrors = [
  ["undeclared id", "likhana(x);", /Identifier x not declared/],
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
