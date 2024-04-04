export function program(statements) {
  return { kind: "Program", statements }
}

export function variableDeclaration(variable, initializer) {
  return { kind: "VariableDeclaration", variable, initializer }
}

// Someday the language will get types, so make it happen here (like Carlos)
export function variable(name) {
  return { kind: "Variable", name }
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

export function shortIfStatement(test, consequent) {
  return { kind: "ShortIfStatement", test, consequent }
}

export function returnStatement(expression) {
  return { kind: "ReturnStatement", expression }
}

export function typeDeclaration(type) {
  return { kind: "TypeDeclaration", type }
}

export const boolType = { kind: "BoolType" }
export const intType = { kind: "IntType" }
export const floatType = { kind: "FloatType" }
export const stringType = { kind: "StringType" }
export const voidType = { kind: "VoidType" }
export const anyType = { kind: "AnyType" }

export function structType(name, fields) {
  return { kind: "StructType", name, fields }
}

export function functionType(paramTypes, returnType) {
  return { kind: "FunctionType", paramTypes, returnType }
}

export function arrayType(baseType) {
  return { kind: "ArrayType", baseType }
}

export function optionalType(baseType) {
  return { kind: "OptionalType", baseType }
}

export function increment(variable) {
  return { kind: "Increment", variable }
}

export function decrement(variable) {
  return { kind: "Decrement", variable }
}


export const standardLibrary = Object.freeze({
  दश: variable("दश"),
})

export function functionDeclaration(fun, params, body) {
  return { kind: "FunctionDeclaration", fun, params, body }
}

export const breakStatement = { kind: "BreakStatement" }

export function whileStatement(test, body) {
  return { kind: "WhileStatement", test, body }
}
