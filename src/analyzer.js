  export default function analyze(match) {
    const anlyzer = match.matcher.grammar.createSemantics().addOperation("rep", {
      Program(statements) {

      },

      PrintStatement(_print, exp, _semi) {
        //return new.core.AssignStatement(id.sourceString, expression.rep())

      },

      VariableDecl(_var, id, _eq, expression, _semi) {

      },

      AssignStatement(id, _eq, exp, _semi) {

      },

      Return(_return, expression, _semi) {


      },

      IfStatement_long(_if, _open, condition, _close, trueBlock, _else, falseBlock) {

      },
    
      IfStatement_elsif(_if, _open, condition, _close, trueBlock, _else, elseifStatement) {
       
      },
    
      IfStatement_short(_if, _open, condition, _close, block) {

      },

      Block(_open, statements, _close) {
       
      },

      FuncDecl(_function, id, _open, params, _close, block) {
        
      },

      Call(id, _open, params, _close) {
        
      },

      Loop_while(_while, condition, block) {
 
      },
    
      Loop_for(_for, loopVar, _eq, startExp, _semi1, breakCondition, _semi2, updateExp, _close, block) {
     
      },

      Exp_unary(operator, exp) {},

      Exp_ternary(condition, _questionMark, trueExp, _colon, falseExp) {},

      Exp1_or(left, _or, right) {},

      Exp2_and(left, _and, right) {},

      Exp3_compare(left, operator, right) {},

      Exp4_add(left, operator, right) {},

      Exp5_multiply(left, operator, right) {},

      Exp6_power(base, _power, exponent) {},

      Exp7_num(num) {},
      Exp7_true(_true) {},
      Exp7_false(_false) {},
      Exp7_Call(call) {},
      Exp7_id(id) {},
      Exp7_parentheses(_open, exp, _close) {},
      Exp7_stringlit(stringlit) {},

    })
    return builder(match).rep  
  }
