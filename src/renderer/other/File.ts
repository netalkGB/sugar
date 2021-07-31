export default class File {
  private _filePath:string
  private _uuid:string
  private _id?:string|null
  private _state:string
  get filePath () {
    return this._filePath
  }

  set filePath (filePath:string) {
    this._filePath = filePath
  }

  get uuid () {
    return this._uuid
  }

  set uuid (uuid:string) {
    this._uuid = uuid
  }

  get id () {
    return this._id
  }

  set id (id:string|undefined|null) {
    this._id = id
  }

  get state () {
    return this._state
  }

  set state (state:string) {
    this._state = state
  }

  constructor ({ filePath, uuid, id, state }:{filePath:string;uuid:string;id?:string;state: 'uploading' | 'done' | 'error'}) {
    this._filePath = filePath
    this._uuid = uuid
    if (id === undefined) {
      this._id = null
    } else {
      this._id = id
    }
    this._state = state
  }

  static setFile ({ filePath, state } :{filePath:string;state: 'uploading' | 'done' | 'error'}) {
    const uuid = window.uuidv4()
    return new File({ filePath, uuid, state })
  }

  changeState ({ newState, id }:{newState: 'uploading' | 'done' | 'error';id:string}) {
    return new File({
      filePath: this._filePath,
      uuid: this._uuid,
      id,
      state: newState
    })
  }
}
