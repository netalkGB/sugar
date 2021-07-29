export default class Field {
  constructor (name, value) {
    this.name = name
    this.value = value
  }

  static fromMastodonField (field) {
    return new Field(field.name, field.value)
  }

  static fromMastodonFields (fields) {
    return fields.map(f => Field.fromMastodonField(f))
  }
}
