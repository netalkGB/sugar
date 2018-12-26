export default class File {
  constructor ({ filePath, uuid, id, state }) {
    this.filePath = filePath
    this.uuid = uuid
    if (id === undefined) {
      this.id = null
    } else {
      this.id = id
    }
    this.state = state
  }
  static setFile ({ filePath, state }) {
    const uuid = window.uuidv4()
    return new File({ filePath, uuid, state })
  }
  changeState ({ newState, id }) {
    return new File({
      filePath: this.filePath,
      uuid: this.uuid,
      id,
      state: newState
    })
  }
}
