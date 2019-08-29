export class Instance {
  protected constructor(public id: string) {}

  public static of(id: string) {
    return new Instance(id)
  }

  public static ensure($reference, $type = null, $container = null) {

  }
}
