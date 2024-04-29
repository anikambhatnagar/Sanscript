import * as core from "./core.js"

const INT = core.intType
const FLOAT = core.floatType
const STRING = core.stringType
const BOOLEAN = core.boolType

class Context {
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

  function getType(token) {
    if (typeof token === 'number' || (typeof token === 'string' && token.match(/^\d+$/))) {
      return "ginti"
    }
    else if (token === "saty" || token === "asaty") {
      return "babla"
    }
    else if (typeof token === 'string' && token.startsWith('"') && token.endsWith('"')) {
      return "dhaga"
    }
    else {
      return null
    }
  }  

  function mustNotAlreadyBeDeclared(name, at) {
    must(!context.lookup(name), `Identifier ${name} already declared`, at)
  }

  function ternary(condition, truePart, falsePart) {
    if (condition.type !== "babla") { 
        throw new Error("Ternary condition must be a boolean")
    }
    if (truePart.type !== falsePart.type) {
        throw new Error("Ternary branches must return the same type")
    }
    return condition.value ? truePart : falsePart
  }

  function mustHaveBeenFound(entity, name, at) {
    must(entity, `Identifier ${name} not declared`, at)
  }

  const builder = match.matcher.grammar.createSemantics().addOperation("rep", {
    Program(statements) {
      return core.program(statements.children.map(s => s.rep()))
    },

    PrintStatement(_print, exp, _semi) {
      return core.printStatement(exp.rep())
    },

    VariableDecl(_var, type, id, _eq, expression, _semi) {
      const initializer = expression.rep()
      const variableType = type.sourceString
      const variable = core.variable(id.sourceString, variableType)
      mustNotAlreadyBeDeclared(id.sourceString, { at: id })
      const initType = initializer.type || getType(initializer) 
      must(variableType === initType, `Type mismatch: expected ${variableType}, got ${initType}`, { at: expression })
      context.add(id.sourceString, variable)
      return core.variableDeclaration(variable, initializer)
    },

    Params(params) {
      return params.rep()
    },
  
    TypedParams(typedParams) {
      return typedParams.rep()
    },
  
    Args(args) {
      return args.rep()
    },
  
    NonemptyListOf(first, _sep, rest) {
      return [first.rep()].concat(rest.rep())
    },
  
    EmptyListOf() {
      return []
    },
  
    TypedParam(type, id) {
      return {
        type: type.rep(),
        identifier: id.rep()
      }
    },

    AssignStatement(variable, _eq, expression, _semi) {
      const target = variable.rep()
      const source = expression.rep()
      const sourceType = source.type
      const targetVariable = context.lookup(variable.sourceString)
      must(targetVariable, `Variable ${variable.sourceString} not found`, { at: variable })
      const targetType = targetVariable.type
      must(targetType === sourceType, `Type mismatch in assignment: expected ${targetType}, got ${sourceType}`, { at: variable })
      return { type: targetType, value: source.value }
    },    

    Return(_return, expression, _semi) {
      const retExpr = expression.rep()
      const returnType = getType(retExpr)
      must(context.function.returnType === returnType, `Return type mismatch: expected ${context.function.returnType}, got ${returnType}`, { at: expression })
      return core.returnStatement(retExpr)
    },

    IfStatement_long(_if, _open, condition, _close, trueBlock, _else, falseBlock) {
      return core.ifStatement(condition.rep(), trueBlock.rep(), falseBlock.rep())
    },

    IfStatement_elsif(_if, _open, condition, _close, trueBlock, _else, elseifStatement) {
      return core.ifStatement(condition.rep(), trueBlock.rep(), elseifStatement.rep().body)
    },

    IfStatement_short(_if, _open, condition, _close, block) {
      return core.shortIfStatement(condition.rep(), block.rep())
    },

    FuncDecl(_function, id, _open, params, _close, _colon, returnType, block) {
      const functionEntity = core.functionEntity(id.sourceString, returnType.sourceString)
      mustNotAlreadyBeDeclared(id.sourceString, { at: id })
      context.add(id.sourceString, functionEntity)
      context = context.newChildContext({ function: functionEntity })
      params.rep()
      const body = block.rep()
      context = context.parent
      return core.functionDeclaration(functionEntity, body)
    },

    Params(params) {
      for (const p of params.children) {
        const paramType = p.children[0].sourceString
        const paramName = p.children[1].sourceString
        mustNotAlreadyBeDeclared(paramName, { at: p })
        const parameter = core.variable(paramName, paramType)
        context.add(paramName, parameter)
        context.function.params.push(parameter)
      }
    },

    // Implementations for specific expressions:

    Block(_open, statements, _close) {
      let previousContext = context
      context = context.newChildContext({})
      const results = statements.children.map(s => s.rep())
      context = previousContext
      return results
    },
    
    Loop_while(_while, _open, condition, _close, block) {
      let conditionResult = condition.rep()
      let blockResult = block.rep()
      return core.whileStatement(conditionResult, blockResult)
    },

    Exp(expression) {
      return expression.rep()
    },

    Exp_ternary(condition, _q, trueExp, _c, falseExp) {
      return core.ternary(condition.rep(), trueExp.rep(), falseExp.rep())
    },

    Exp1_or(left, _op, right) {
      return core.binary('||', left.rep(), right.rep())
    },
  
    Exp2_and(left, _op, right) {
      return core.binary('&&', left.rep(), right.rep())
    }, 
    
    Exp3_compare(left, operator, right) {
      return core.binary(operator.sourceString, left.rep(), right.rep())
    },

    Exp4_add(left, op, right) {
      return core.binary(op.sourceString, left.rep(), right.rep())
    },
  
    Exp5_multiply(left, op, right) {
      return core.binary(op.sourceString, left.rep(), right.rep())
    },
  
    Exp6_power(base, _op, exponent) {
      return core.binary('**', base.rep(), exponent.rep())
    },
    
    Exp7_parentheses(_open, exp, _close) {
      return exp.rep()
    }, 

    stringlit(_open, chars, _close) {
      return chars.sourceString
    },

    num(_) {
      return Number(this.sourceString)
    },

    id(letter, alnums) {
      return letter.sourceString + alnums.sourceString
    },

    _terminal() {
      return this.sourceString
    },

    _iter(...children) {
      return children.map(child => child.rep())
    }

  })

  return builder(match).rep()
}