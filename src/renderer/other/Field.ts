
export default class Field {
  private _name:string
  private _value:string

  get name():string {
    return this._name
  }

  set name(name:string) {
    this._name = name
  }

  get value():string {
    return this._value
  }

  set value(value:string) {
    this._value = value
  }

  constructor (name:string, value:string) {
    this._name = name
    this._value = value
  }

  public static fromMastodonField (field:Field) {
    return new Field(field.name, field.value)
  }

  public static fromMastodonFields (fields:Array<Field>) {
    return fields.map(f => Field.fromMastodonField(f))
  }
}
