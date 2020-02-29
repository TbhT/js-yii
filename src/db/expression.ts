import { BaseObject } from '../base/base-object'
import { IndexableObj } from '../factory/definitions'

export interface ExpressionInterface {}

export interface ExpressionBuilderInterface {
  build(expression: ExpressionInterface, params: IndexableObj): string
}

export class Expression extends BaseObject implements ExpressionInterface {
  public constructor(public expression: string, public params: any[] = []) {
    super()
  }

  public toString(): string {
    return this.expression
  }
}

export class ExpressionBuilder implements ExpressionBuilderInterface {
  constructor(protected queryBuilder) {}
}
