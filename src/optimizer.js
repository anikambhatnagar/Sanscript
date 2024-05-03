import * as core from './core.js';

function optimizeAST(node) {
  switch (node.kind) {
    case "BinaryExpression":
      if (node.left.kind === "Literal" && node.right.kind === "Literal") {
        return evaluateBinaryExpression(node);
      }
      break;
    case "IfStatement":
      if (node.test.kind === "Literal") {
        return optimizeAST(node.test.value ? node.consequent : node.alternate);
      }
      break;
    case "WhileStatement":
      if (node.test.kind === "Literal" && !node.test.value) {
        return null; // Remove the loop if the condition is statically false
      }
      break;
    case "ForStatement":
      return unrollLoop(node);
  }

  // Recursively optimize child nodes
  node.children = node.children.map(optimizeAST);
  return node;
}

function unrollLoop(loopNode) {
    // Example threshold for unrolling loops
    const iterations = determineIterations(loopNode.init, loopNode.condition, loopNode.update);
    if (iterations <= 4) { 
        return expandLoop(loopNode.body, iterations);
    }
    return loopNode; // Return the original loop if not unrolling
}

function evaluateBinaryExpression(expression) {
  const left = expression.left.value;
  const right = expression.right.value;
  switch(expression.op) {
    case "+": return { kind: "Literal", value: left + right };
    // Add other operations ria
  }
}

function determineIterations(init, condition, update) {
  return 4; // Placeholder value
}

function expandLoop(body, iterations) {
  const expandedBody = [];
  for (let i = 0; i < iterations; i++) {
    expandedBody.push(...body);  // Duplicates the body
  }
  return { kind: 'Block', statements: expandedBody };
}

export default function optimize(ast) {
  return optimizeAST(ast);
}
