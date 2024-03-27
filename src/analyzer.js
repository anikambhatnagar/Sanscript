import * as core from "./core.js"

class Context {
  // Like most statically-scoped languages, Carlos contexts will contain a
  // map for their locally declared identifiers and a reference to the parent
  // context. The parent of the global context is null. In addition, the
  // context records whether analysis is current within a loop (so we can
  // properly check break statements), and reference to the current function
  // (so we can properly check return statements).
  constructor({
    parent = null,
    locals = new Map(),
    inLoop = false,
    function: f = null,
  }) {
    Object.assign(this, { parent, locals, inLoop, function: f })
  }
  add(name, entity) {
    this.locals.set(name, entity)
  }
  lookup(name) {
    return this.locals.get(name) || this.parent?.lookup(name)
  }
  static root() {
    return new Context({
      locals: new Map(Object.entries(core.standardLibrary)),
    })
  }
  newChildContext(props) {
    return new Context({ ...this, ...props, parent: this, locals: new Map() })
  }
}

export default function analyze(match) {
  let context = Context.root()

  function must(condition, message, errorLocation) {
    if (!condition) {
      const prefix = errorLocation.at.source.getLineAndColumnMessage()
      throw new Error(`${prefix}${message}`)
    }
  }

  function mustNotAlreadyBeDeclared(name, at) {
    must(!context.lookup(name), `Identifier ${name} already declared`, at)
  }

  const builder = match.matcher.grammar.createSemantics().addOperation("rep", {
    Program(statements) {
      return core.program(statements.children.map((s) => s.rep()))
    },

    PrintStatement(_print, exp, _semi) {
      return core.printStatement(exp.rep())
    },

    VariableDecl(_var, id, _eq, expression, _semi) {
      const initializer = expression.rep()
      const variable = core.variable(id.sourceString)
      mustNotAlreadyBeDeclared(id.sourceString, { at: id })
      context.add(id.sourceString, variable)
      return core.variableDeclaration(variable, initializer)
    },

    AssignStatement(variable, _eq, expression, _semi) {
      const source = expression.rep()
      const target = variable.rep()
      mustBeAssignable(source, { toType: target.type }, { at: variable })
      return core.assignment(target, source)
    },

    Return(_return, expression, _semi) {
      return core.returnStatement(expression.rep())
    },

    IfStatement_long(
      _if,
      _open,
      condition,
      _close,
      trueBlock,
      _else,
      falseBlock
    ) {},

    IfStatement_elsif(
      _if,
      _open,
      condition,
      _close,
      trueBlock,
      _else,
      elseifStatement
    ) {},

    IfStatement_short(_if, _open, condition, _close, block) {},

    Block(_open, statements, _close) {},

    FuncDecl(_function, id, _open, params, _close, block) {},

    Call(id, _open, params, _close) {},

    Loop_while(_while, condition, block) {},

    // for id "=" Exp ";" break Exp ";" id "=" Exp ";" Block
    Loop_for(
      _for,
      loopVar,
      _eq,
      startExp,
      _semi1,
      _breakWord,
      breakCondition,
      _semi2,
      updateVar,
      _eq2,
      updateExp,
      _semi3,
      block
    ) {},

    Exp_unary(operator, exp) {},

    Exp_ternary(condition, _questionMark, trueExp, _colon, falseExp) {},

    Exp1_or(left, _or, right) {},

    Exp2_and(left, _and, right) {},

    Exp3_compare(left, operator, right) {},

    Exp4_add(left, operator, right) {},

    Exp5_multiply(left, operator, right) {},

    Exp6_power(base, _power, exponent) {},

    num(num) {
      return Number(this.sourceString)
    },
    true(_true) {
      return true
    },
    false(_false) {
      return false
    },
    Exp7_call(call) {},
    Exp7_id(id) {},
    Exp7_parentheses(_open, exp, _close) {
      return exp.rep()
    },
    stringlit(_openQuote, _chars, _closeQuote) {
      // Sanscript strings will be represented as plain JS strings, including
      // the quotation marks
      return this.sourceString
    },
  })
  return builder(match).rep()
}
