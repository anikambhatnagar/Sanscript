import assert from "node:assert/strict"
import parse from "../src/parser.js"
import analyze from "../src/analyzer.js"
import optimize from "../src/optimizer.js"
import generate from "../src/generator.js"

function dedent(s) {
  return `${s}`.replace(/(?<=\n)\s+/g, "").trim()
}

const fixtures = [
  {
    name: "small",
    source: `
      sankhya x = 3 * 7;
      sankhya y = 4-3;
      likhana("hello");
    `,
    // above produces undefined for likhana idk why
    expected: dedent`
      let x_1 = 3 * 7;
      let y_2 = 4-3;
      console.log("hello");
    `,
  },
  {
    name: "while",
    source: `
      sankhya x = 0;
      jabtaki (x < 5) {
        sankhya y = 0;
        jabtaki (y < 5) {
          likhana (x * y);
          y = y + 1;
        }
        x = x + 1;
      }
    `,
    expected: dedent`
      let x_1 = 0;
      while ((x_1 < 5)) {
      let y_2 = 0;
      while ((y_2 < 5)) {
      console.log((x_1 * y_2));
      y_2 = (y_2 + 1);
      }
      x_1 = (x_1 + 1);
      }
    `,
  },
  {
    name: "functions",
    source: `
      prakriya even(x) {
        laana (x % 2 == 0);
    }
      sankhya x = 4;
    `,
    expected: dedent`
      function even(x_1) {
        return (x_1 % 2 == 0);
      }
      let x_1 = 4;
    `,
  },
  /*
  {
    name: "if",
    source: `
    sankhya x = 5;
    agar (x > 10) {
      likhana "x is greater than 10";
    } varana agar (x < 10) {
      likhana "x is less than 10";
    } varana {
      likhana "x is equal to 10";
    }
    `,
    expected: dedent`
        let x_1 = 5;
        if  (x_1 > 10) {
            console.log("x is greater than 10");
        } else if  (x_1 < 10) { 
            console.log("x is less than 10");
        } else { 
            console.log("x is equal to 10");   
            }
    `,
  },
  */
  /*
  {
    name: "standard library",
    source: `
      let x = π;
      print(sin(x) - cos(x) + exp(x) * ln(x) / hypot(2.3, x));
    `,
    expected: dedent`
      let x_1 = Math.PI;
      console.log(((Math.sin(x_1) - Math.cos(x_1)) + ((Math.exp(x_1) * Math.log(x_1)) / Math.hypot(2.3,x_1))));
    `,
  },
  */
]

describe("The code generator", () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name} program`, () => {
      const actual = generate((analyze(parse(fixture.source))))
      assert.deepEqual(actual, fixture.expected)
    })
  }
})