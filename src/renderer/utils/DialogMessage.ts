import * as messages from '@/constants/DialogMessage'

interface DialogMessageList {
  [index:string]: string
}

export default class DialogMessage {
  private static _messageList: DialogMessageList
  private static _currentLanguage:string
  static getMessages (language:string) {
    if (!this._messageList || this._currentLanguage !== language) {
      this._messageList = {}
      const allLanguageMessage = messages.default
      for (const key in allLanguageMessage) {
        const message = allLanguageMessage[key].find(message => message.language === language)?.message
        if (message) {
          this._messageList[key] = message
        }
      }
    }
    return this._messageList
  }
}
