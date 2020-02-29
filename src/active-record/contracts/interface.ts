export interface IndexObj {
  [key: string]: any
}

export abstract class ActiveRecordInterface {
  public static primaryKey(): string
  public attributes(): string[]
  public getAttribute(name: string): any
  public setAttribute(name: string, value: any)
  public hasAtrribute(name: string): boolean
  public getPrimaryKey(asArray: boolean)
  public getOldPrimaryKey(asArray: boolean)
  public static isPrimaryKey(keys: string[]): boolean
  public static find(): ActiveQueryInterface
  public static findOne(): ActiveRecordInterface | null
  public static findAll(condition: any): ActiveRecordInterface[]
  public static updateAll(
    attributes: IndexObj,
    condition: any,
    params: IndexObj
  ): number
  public static deleteAll(condition: any): number
  public save(attributeNames: string[] | null): boolean
  public insert(attributeNames: string[] | null): boolean
  public update(attributeNames: string[] | null): boolean
  public delete(): number | boolean
  public getIsNewRecord(): boolean
  public equal(record: ActiveRecordInterface): boolean
  public getRelation(name: string, throwException: boolean): ActiveQueryInterface
  public populationRelation(name: string, records: ActiveRecordInterface | ActiveRecordInterface[] | null)
  public link(name: string, model: ActiveRecordInterface, extraColumns: IndexObj)
  public unlink(name: string, model: ActiveRecordInterface, delete: boolean)
}
