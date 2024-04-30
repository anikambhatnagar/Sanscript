export function program(statements) {
  return { kind: "Program", statements }
}

export function variableDeclaration(variable, initializer) {
  return { kind: "VariableDeclaration", variable, initializer }
}

export function variable(name, type) {
  return { kind: "Variable", name, type }
}

export function printStatement(expression) {
  return { kind: "PrintStatement", expression }
}

export function assignment(target, source) {
  return { kind: "Assignment", target, source }
}

export function ifStatement(test, consequent, alternate) {
  return { kind: "IfStatement", test, consequent, alternate }
}

//export function ternaryStatement(condition, trueExp, falseExp){
//return {kind: "TernaryStatement", condition, trueExp, falseExp}
//}
export function ternary(condition, truePart, falsePart) {
  if (condition.type !== "babla") {
    throw new Error("Ternary condition must be a boolean")
  }
  if (truePart.type !== falsePart.type) {
    throw new Error("Ternary branches must return the same type")
  }
  return condition.value ? truePart : falsePart
}

export function unaryminusStatement(operand, exp) {
  return { kind: "UnaryMinusStatement", operand, exp }
}

export function shortIfStatement(test, consequent) {
  return { kind: "ShortIfStatement", test, consequent }
}

export function returnStatement(expression) {
  return { kind: "ReturnStatement", expression }
}

export const boolType = { kind: "BoolType" }
export const intType = { kind: "IntType" }
export const floatType = { kind: "FloatType" }
export const stringType = { kind: "StringType" }
export const voidType = { kind: "VoidType" }
export const anyType = { kind: "AnyType" }

// export function structType(name, fields) {
//   return { kind: "StructType", name, fields }
// }

// export function functionType(paramTypes, returnType) {
//   return { kind: "FunctionType", paramTypes, returnType }
// }

// export function arrayType(baseType) {
//   return { kind: "ArrayType", baseType }
// }

// export function optionalType(baseType) {
//   return { kind: "OptionalType", baseType }
// }

export function functionDeclaration(fun, body) {
  return { kind: "FunctionDeclaration", fun, body }
}

export function functionEntity(name, returnType, paramTypes = []) {
  return { kind: "Function", name, params: [], returnType, paramTypes }
}

export const breakStatement = { kind: "BreakStatement" }

export function whileStatement(test, body) {
  return { kind: "WhileStatement", test, body }
}

/*export function forStatement(init, test, update, body) {
  return { kind: "ForStatement", init, test, update, body }
}
*/
export function binary(op, left, right, type) {
  // if (left.type !== right.type) {
  //   throw new Error("Type error: Operand types do not match.")
  // }
  return { kind: "BinaryExpression", op, left, right, type }
}

export const standardLibrary = Object.freeze({
  दश: variable("दश"),
})
