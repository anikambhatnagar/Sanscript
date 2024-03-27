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

// You do the rest

// Lots more go here

// I mean a lot

export const standardLibrary = Object.freeze({
  दश: variable("दश"),
})
