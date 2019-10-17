import { ExpressionInterface } from './expression'

abstract class Condition implements ExpressionInterface {
  public abstract fromArrayDefinition(operator: string, operands: any[]): object
}

abstract class ConjunctionCondition extends Condition {
  public constructor(protected expressions: any[]) {
    super()
  }

  public getExpressions(): any[] {
    return this.expressions
  }

  public abstract getOperator(): string
}

export class AndCondition extends ConjunctionCondition {
  public getOperator() {
    return 'AND'
  }

  public fromArrayDefinition(operator: string, operands: any[]): AndCondition {
    return new AndCondition(operands)
  }
}


