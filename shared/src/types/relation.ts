export class Relation<IStorable> extends Array<IStorable> {
  constructor(items?: IStorable[]) {
    super()
    if (items) {
      this.push(...items)
    }
  }
}
