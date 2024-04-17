import { BadRequestException, Injectable } from '@nestjs/common';
import { CalcDto } from './calc.dto';

@Injectable()
export class CalcService {
  calculateExpression(calcBody: CalcDto) {
    const { expression } = calcBody;

    // check for valid expression
    if(!this.isValidExpression(expression)) {
      throw new BadRequestException("Invalid expression provided");
    }

    try {
      const result = this.evaluateExpression(expression);
      return result;
    } catch(error) {
      throw new BadRequestException('Invalid expression provided');
    }
  }

  private isValidExpression(expression: string): boolean {
    // regular expression for matching mathematical expression.
    const validExpressionRegex = /^(\d+(\.\d+)?)([\+\-\*\/](\d+(\.\d+)?))*$/;
    return validExpressionRegex.test(expression);
  }

  // function used to evaluate the expression
  private evaluateExpression(expression: string): number {
    const precedenceMap: { [key: string]: number } = {
      '+': 1,
      '-': 1,
      '*': 2,
      '/': 2,
    };
  
    const parts = expression.split(/([\+\-\*\/])/g);
    const stack: (string | number)[] = [];
    const outputQueue: (string | number)[] = [];
  
    for (const token of parts) {
      if (token in precedenceMap) {
        while (
          stack.length > 0 &&
          precedenceMap[token] <= precedenceMap[stack[stack.length - 1] as string]
        ) {
          outputQueue.push(stack.pop() as string);
        }
        stack.push(token);
      } else {
        outputQueue.push(parseFloat(token));
      }
    }
  
    while (stack.length > 0) {
      outputQueue.push(stack.pop() as string);
    }
  
    const resultStack: number[] = [];
    for (const token of outputQueue) {
      if (typeof token === 'number') {
        resultStack.push(token);
      } else {
        const operand2 = resultStack.pop() as number;
        const operand1 = resultStack.pop() as number;
  
        switch (token) {
          case '+':
            resultStack.push(operand1 + operand2);
            break;
          case '-':
            resultStack.push(operand1 - operand2);
            break;
          case '*':
            resultStack.push(operand1 * operand2);
            break;
          case '/':
            if (operand2 === 0) {
              throw new Error('Division by zero');
            }
            resultStack.push(operand1 / operand2);
            break;
          default:
            throw new Error('Invalid operator');
        }
      }
    }
  
    if (resultStack.length !== 1) {
      throw new Error('Invalid expression');
    }
  
    return resultStack[0];
  }

}

