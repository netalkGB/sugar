import storage from 'electron-json-storage'

const has = key =>
  new Promise((resolve, reject) => {
    storage.has(key, (err, hasKey) => {
      if (err) {
        reject(err)
      }
      resolve(hasKey)
    })
  })

const get = key =>
  new Promise((resolve, reject) => {
    storage.get(key, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })

export default class Settings {
  static async getUsers () {
    const hasUsers = await has('users')
    if (hasUsers === false) {
      return null
    } else {
      const users = await get('users')
      if (users !== null) {
        return users
      } else {
        return null
      }
    }
  }
  static saveUsers (data) {
    return new Promise((resolve, reject) => {
      storage.set('users', data, e => {
        if (!e) {
          resolve()
        }
        reject(e)
      })
    })
  }
}
