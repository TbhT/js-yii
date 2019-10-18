import { Component } from '../base/component'
import { ExpressionInterface } from './expression'
import { IndexableObj } from '../factory/definitions'
import { isObject, isArray } from 'util'
import { SORT_ASC, SORT_DESC } from '../base/advance-type'
import { IndexedObjType } from '../base/base-yii'

type ConditionType = IndexableObj | any[]

interface QueryInterface {
  /**
   * executes the query and returns all results as an array
   *
   * @param db
   *
   *
   */
  all(db): any[]

  /**
   * executes the query and returns a single row of result
   */
  one(db): any[]

  /**
   * return the number of records
   */
  count(q: string): number

  /**
   * returns a value indicating whether the query result contains
   * any of data
   *
   * @param $db
   */
  exists(db): boolean

  /**
   *
   * @param column the name of the column by which the query results should be indexed by.
   * This can also be a callable (e.g. anonymous function) that returns the index value
   * based on the given
   * row data.
   */
  indexBy(column: string): object

  /**
   *
   * Sets the WHERE part of the query.
   *
   * The `condition` specified as an array can be in one of the following two formats:
   *
   * - hash format: `{column1: value1, column2: value2, ...]`
   * - operator format: `[operator, operand1, operand2, ...]`
   *
   * A condition in hash format represents the following SQL expression in general:
   * `column1=value1 AND column2=value2 AND ...`. In case when a value is an array,
   * an `IN` expression will be generated. And if a value is `null`, `IS NULL` will be used
   * in the generated expression. Below are some examples:
   *
   * - `{type: 1, status: 2}` generates `(type = 1) AND (status = 2)`.
   * - `{'id' : [1, 2, 3], 'status' : 2}` generates `(id IN (1, 2, 3)) AND (status = 2)`.
   * - `{'status' : null}` generates `status IS NULL`.
   *
   * A condition in operator format generates the SQL expression according to the specified operator, which
   * can be one of the following:
   *
   * - **and**: the operands should be concatenated together using `AND`. For example,
   *   `['and', 'id=1', 'id=2']` will generate `id=1 AND id=2`. If an operand is an array,
   *   it will be converted into a string using the rules described here. For example,
   *   `['and', 'type=1', ['or', 'id=1', 'id=2']]` will generate `type=1 AND (id=1 OR id=2)`.
   *   The method will *not* do any quoting or escaping.
   *
   * - **or**: similar to the `and` operator except that the operands are concatenated using `OR`. For example,
   *   `['or', ['type' : [7, 8, 9]], ['id' : [1, 2, 3]]]` will generate `(type IN (7, 8, 9) OR (id IN (1, 2, 3)))`.
   *
   * - **not**: this will take only one operand and build the negation of it by prefixing the query string with `NOT`.
   *   For example `['not', ['attribute' : null]]` will result in the condition `NOT (attribute IS NULL)`.
   *
   * - **between**: operand 1 should be the column name, and operand 2 and 3 should be the
   *   starting and ending values of the range that the column is in.
   *   For example, `['between', 'id', 1, 10]` will generate `id BETWEEN 1 AND 10`.
   *
   * - **not between**: similar to `between` except the `BETWEEN` is replaced with `NOT BETWEEN`
   *   in the generated condition.
   *
   * - **in**: operand 1 should be a column or DB expression, and operand 2 be an array representing
   *   the range of the values that the column or DB expression should be in. For example,
   *   `['in', 'id', [1, 2, 3]]` will generate `id IN (1, 2, 3)`.
   *   The method will properly quote the column name and escape values in the range.
   *
   *   To create a composite `IN` condition you can use and array for the column name and value, where the values are
   * indexed by the column name:
   *   `['in', ['id', 'name'], [['id' : 1, 'name' : 'foo'], ['id' : 2, 'name' : 'bar']] ]`.
   *
   *   You may also specify a sub-query that is used to get the values for the `IN`-condition:
   *   `['in', 'user_id', (new Query())->select('id')->from('users')->where(['active' : 1])]`
   *
   * - **not in**: similar to the `in` operator except that `IN` is replaced with `NOT IN` in the generated condition.
   *
   * - **like**: operand 1 should be a column or DB expression, and operand 2 be a string or an array representing
   *   the values that the column or DB expression should be like.
   *   For example, `['like', 'name', 'tester']` will generate `name LIKE '%tester%'`.
   *   When the value range is given as an array, multiple `LIKE` predicates will be generated and concatenated
   *   using `AND`. For example, `['like', 'name', ['test', 'sample']]` will generate
   *   `name LIKE '%test%' AND name LIKE '%sample%'`.
   *   The method will properly quote the column name and escape special characters in the values.
   *   Sometimes, you may want to add the percentage characters to the matching value by yourself, you may supply
   *   a third operand `false` to do so. For example, `['like', 'name', '%tester', false]` will generate `name LIKE '%tester'`.
   *
   * - **or like**: similar to the `like` operator except that `OR` is used to concatenate the `LIKE`
   *   predicates when operand 2 is an array.
   *
   * - **not like**: similar to the `like` operator except that `LIKE` is replaced with `NOT LIKE`
   *   in the generated condition.
   *
   * - **or not like**: similar to the `not like` operator except that `OR` is used to concatenate
   *   the `NOT LIKE` predicates.
   *
   * - **exists**: operand 1 is a query object that used to build an `EXISTS` condition. For example
   *   `['exists', (new Query())->select('id')->from('users')->where(['active' : 1])]` will result in the following SQL expression:
   *   `EXISTS (SELECT "id" FROM "users" WHERE "active"=1)`.
   *
   * - **not exists**: similar to the `exists` operator except that `EXISTS` is replaced with `NOT EXISTS` in the generated condition.
   *
   * - Additionally you can specify arbitrary operators as follows: A condition of `['>=', 'id', 10]` will result in the
   *   following SQL expression: `id >= 10`.
   *
   * **Note that this method will override any existing WHERE condition. You might want to use [[andWhere()]] or [[orWhere()]] instead.**
   *
   * @param condition
   */
  where(condition: IndexableObj): object

  andWhere(condition: any[]): object

  orWhere(condition: any[]): object

  filterWhere(condition: any[]): object

  andFilterWhere(condition: any[]): object

  orFilterWhere(condition: any[]): object

  orderBy(columns: string | any[]): object

  addOrderBy(columns: string | any[]): object

  limit(limit: number | null): object

  offset(limit: number | null): object

  emulateExecution(value: boolean): object
}

abstract class AQuery extends Component
  implements QueryInterface, ExpressionInterface {
  abstract all(db): any[]

  abstract one(db): any[]

  abstract count(q: string): number

  abstract exists(db): boolean

  private $where: any = null

  private $limit: any

  private $offset: any

  private $orderBy: IndexableObj | null = null

  private $indexBy: any

  private $emulateExecution: any

  public indexBy(column: string): AQuery {
    this.$indexBy = column
    return this
  }

  public where(condition: ConditionType): AQuery {
    this.$where = condition
    return this
  }

  public andWhere(condition: ConditionType): AQuery {
    if (this.$where === null) {
      this.$where = condition
    } else {
      this.$where = ['and', this.$where, condition]
    }

    return this
  }

  public orWhere(condition: ConditionType): AQuery {
    if (this.$where === null) {
      this.$where = condition
    } else {
      this.$where = ['or', this.$where, condition]
    }

    return this
  }

  protected filterCondition(condition: ConditionType): ConditionType {
    const isObj = isObject(condition)
    const isAr = isArray(condition)
    if (!isObj || !isAr) {
      return condition
    }

    if (isObject(condition)) {
      Object.keys(<IndexableObj>condition).map(key => {
        if (!(<IndexableObj>condition)[key]) {
          delete (<IndexableObj>condition)[key]
        }
      })

      return condition
    }

    const operator: string = condition.shift()

    switch (operator.toUpperCase()) {
      case 'NOT':
      case 'AND':
      case 'OR':
        {
          ;(<any[]>condition).map((operand: ConditionType, index: number) => {
            const subCondition = this.filterCondition(operand)
            if (!subCondition) {
              delete (<any[]>condition)[index]
            } else {
              ;(<any[]>condition)[index] = subCondition
            }
          })
        }
        break
      case 'BETWEEN':
      case 'NOT BETWEEN':
        if (!(<any[]>condition)[1] || !(<any[]>condition)[2]) {
          return []
        }
        break
      default:
        if (!(<any[]>condition)[1]) {
          return []
        }
        break
    }

    ;(<any[]>condition).unshift(operator)

    return <any[]>condition
  }

  public filterWhere(condition: ConditionType): AQuery {
    condition = this.filterCondition(condition)
    if (!condition.length) {
      this.where(condition)
    }

    return this
  }

  public andFilterWhere(condition: ConditionType): AQuery {
    condition = this.filterCondition(condition)
    if (!condition.length) {
      this.andWhere(condition)
    }

    return this
  }

  public orFilterWhere(condition: ConditionType): AQuery {
    condition = this.filterCondition(condition)
    if (!condition.length) {
      this.orWhere(condition)
    }

    return this
  }

  protected normalizeOrderBy(columns: string | IndexableObj) {
    if (isArray(columns)) {
      return columns
    }

    columns = columns.split(/\s*?,\s*?/)
    const result: IndexableObj = {}
    const colRegexp = /^(.*?)\s+(asc|desc)$/i

    for (const col of <string[]>columns) {
      if (colRegexp.test(col)) {
        const matches = <RegExpExecArray>colRegexp.exec(col)
        result[matches[1]] = matches[2] === 'asc' ? SORT_ASC : SORT_DESC
      } else {
        result[col] = SORT_ASC
      }
    }

    return result
  }

  public orderBy(columns: string | IndexableObj): AQuery {
    this.$orderBy = this.normalizeOrderBy(columns)
    return this
  }

  public addOrderBy(columns: string | IndexableObj): AQuery {
    columns = this.normalizeOrderBy(columns)
    if (this.$orderBy === null) {
      this.$orderBy = columns
    } else {
      const oldOrderBy = Object.entries(this.$orderBy)
      const newOrderBy = Object.entries(columns)
      const allOrderBy = [...oldOrderBy, ...newOrderBy]
      const allObj: IndexableObj = {}
      allOrderBy.map(entry => {
        allObj[entry[0]] = entry[1]
      })
      this.$orderBy = allObj
    }

    return this
  }

  public limit(limit: number): AQuery {
    this.$limit = limit
    return this
  }

  public offset(offset: number): AQuery {
    this.$offset = offset
    return this
  }

  public emulateExecution(value = true): AQuery {
    this.$emulateExecution = value
    return this
  }
}

export class Query extends AQuery {
    
}
