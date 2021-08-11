<template>
  <div class="newToot">
    <div
      v-if="isCW"
      class="contentWarning"
    >
      <input
        v-model="spoilerText"
        class="cw"
        :disabled="sending"
        placeholder="ここに警告を書いてください"
      >
    </div>
    <div class="inputToot">
      <textarea
        ref="toottext"
        :value="toot"
        :disabled="sending"
        class="toot"
        autofocus
        placeholder="今何してる？"
        @input="handleInput"
      />
    </div>
    <div class="menu">
      <div>
        <MtButton
          class="item addFile"
          :disabled="files.length >= 4 || sending"
          @click.native="addFile"
        >
          写真を追加
        </MtButton>
        <MtSelect
          v-model="visibility"
          class="item permission"
          :disabled="sending"
        >
          <option value="public">
            公開
          </option>
          <option value="unlisted">
            未収載
          </option>
          <option value="private">
            フォロワー限定
          </option>
          <option value="direct">
            ダイレクト
          </option>
        </MtSelect>
        <label class="item iscw">
          CW:<input
            v-model="isCW"
            type="checkbox"
            :disabled="sending"
          >
        </label>
      </div>
      <div class="tootlength">
        {{ tootLength }}
      </div>
    </div>
    <div class="menu">
      <MtButton
        :disabled="isCanToot === false"
        type="submit"
        class="item"
        @click.native="postToot"
      >
        トゥート
      </MtButton>
    </div>
    <Images
      :files="files"
      class="imgs"
      @removeFile="removeFile"
    />
  </div>
</template>

<script>
import Images from '@/components/NewToot/Images'
import logger from '@/other/Logger'
import FileState from '@/other/FileState'
import File from '@/other/File'
import contextMenu from '@/other/contextMenu'
import MtButton from '@/components/Form/MtButton'
import MtSelect from '@/components/Form/MtSelect'
import Mastodon from '@/other/Mastodon'
import ServerSideError from '@/other/ServerSideError'
import DialogMessage from '@/utils/DialogMessage'
import { mapActions } from 'vuex'

const maxTootLength = 500

export default {
  components: {
    MtButton,
    MtSelect,
    Images
  },
  props: {
    userId: {
      type: Number,
      required: true
    },
    inReplyToID: {
      type: String,
      default: null
    },
    destinations: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      toot: '',
      visibility: 'public',
      spoilerText: '',
      maxTootLength,
      isCW: false,
      files: [],
      keys: {},
      sending: false,
      copyInReplyToID: null,
      copyDestination: null
    }
  },
  computed: {
    tootLength () {
      return maxTootLength - this.toot.length
    },
    isPreparingImage () {
      return (
        this.files.find(
          val =>
            val.state === FileState.error || val.state === FileState.uploading
        ) !== undefined
      )
    },
    isCanToot () {
      if (this.sending) {
        return false
      } else if (
        this.isPreparingImage ||
        ((this.toot.length <= 0 || this.toot.length > 500) &&
          this.files.length <= 0)
      ) {
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    isCW (newVal) {
      if (newVal === false) {
        this.spoilerText = ''
      }
      this.$emit('requireHeightChange', {
        cw: newVal,
        fileList: this.files.length > 0
      })
    },
    files (newVal) {
      this.$emit('requireHeightChange', {
        cw: this.isCW,
        fileList: newVal.length > 0
      })
    }
  },
  mounted () {
    this.$refs.toottext.addEventListener('contextmenu', (e) => {
      e.preventDefault()
      contextMenu()
    })
  },
  beforeDestroy () {
    this.$refs.toottext.removeListener('contextmenu', () => { })
    window.removeEventListener('keydown', () => { })
  },
  methods: {
    setup () {
      this.copyDestination = this.destinations
      this.copyInReplyToID = this.inReplyToID
      if (location.href.search('destinations=') < 0) {
        this.copyDestination = null
      }
      if (location.href.search('inReplyToID=') < 0) {
        this.copyInReplyToID = null
      }
      if (this.copyDestination !== null) {
        this.toot = '@' + (this.copyDestination.split(',').join(' @')) + ' '
        this.$refs.toottext.focus()
      }
      const { accessToken, host } = this.$store.getters['users/getCurrentUser']
      this.keys.accessToken = accessToken
      this.keys.host = host
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 13 && this.isCanToot) {
          this.postToot()
        }
      })
    },
    postToot () {
      this.sending = true
      const { accessToken, host } = this.keys
      const { isCW, toot, visibility, spoilerText, files } = this
      let params = {
        status: toot,
        visibility
      }
      if (this.copyInReplyToID && this.toot.search(this.copyDestination) > 0) {
        params = { ...params, inReplyToID: this.inReplyToID }
      }
      if (isCW === true) {
        params = { ...params, isCW, spoilerText }
      }
      if (isCW === true && files.length > 0) {
        params = { ...params, sensitive: true }
      }
      if (files.length > 0) {
        const mediaIDs = this.files.map(val => val.id)
        params = { ...params, mediaIDs }
      }
      logger.debug('send', { accessToken, host, toot: params })
      Mastodon.getMastodon({ accessToken, host }).postToot(params).then(() => {
        if (host !== this.keys.host && accessToken !== this.keys.accessToken) {
          return
        }
        if (this.copyInReplyToID !== null) {
          window.close()
        }
        this.clearForm()
        this.sending = false
        this.$refs.toottext.focus()
      }).catch((e) => {
        if (host !== this.keys.host && accessToken !== this.keys.accessToken) {
          return
        }
        this.sending = false
        logger.error(e)
        const messages = DialogMessage.getMessages('ja')
        this.showMessage({ message: messages.tootRequestError })
      })
    },
    handleInput (e) {
      const value = e.target.value
      this.toot = value
    },
    addFile () {
      ipc.invoke('openDialog').then((appendFile) => {
        if (appendFile !== null) {
          const { filePaths } = appendFile
          filePaths.forEach((filePath) => {
            const file = File.setFile({ filePath, state: FileState.uploading })
            this.files = [...this.files, file]
            this.uploadFile(file)
          })
        }
      }).catch((error) => {
        logger.error(error)
        const messages = DialogMessage.getMessages('ja')
        this.showMessage({ message: messages.fileAddError })
      })
    },
    uploadFile (file) {
      const { accessToken, host } = this.keys
      const { filePath, uuid } = file
      Mastodon.getMastodon({ accessToken, host }).uploadFile({ filePath }).then((data) => {
        if (host !== this.keys.host && accessToken !== this.keys.accessToken) {
          return
        }
        if (this.files.find(val => val.uuid === uuid) === null) {
          return
        }
        const id = data.id
        const url = data.url
        this.files = this.files.map(
          (val) => {
            if (val.uuid === uuid) {
              return val.changeState({ newState: FileState.done, id, url })
            }
            return val
          }
        )
      }).catch((err) => {
        if (err instanceof ServerSideError) {
          this.files = this.files.map(
            val =>
              val.uuid === uuid
                ? val.changeState({ newState: FileState.error, id: null })
                : val
          )
        } else {
          this.files = this.files.map(
            val => (val.uuid === uuid ? { ...val, state: FileState.error } : val)
          )
        }
        logger.error(err)
        const messages = DialogMessage.getMessages('ja')
        this.showMessage({ message: messages.fileUploadError })
      })
    },
    removeFile (idx) {
      this.files = this.files.filter((_val, index) => idx !== index)
    },
    clearForm () {
      this.toot = ''
      this.spoilerText = ''
      this.spoilerText = ''
      this.files = []
      this.copyInReplyToID = null
      this.copyDestination = null
    },
    ...mapActions('modal', ['showMessage'])
  }
}
</script>

<style scoped>
.newToot {
  width: 100%;
  height: 100%;
}
.toot {
  border: none;
  width: calc(100% - 8px);
  height: 50px;
  padding: 4px;
  margin: 0;
  resize: none;
  outline: none;
  user-select: auto;
}
.inputToot {
  height: 58px;
  margin-top: 4px;
  margin-bottom: 4px;
}
.menu {
  display: flex;
  justify-content: space-between;
  height: auto;
  margin-bottom: 4px;
  width: 320px;
}

.item {
  height: 25px;
  font-size: 11px;
}

.cw {
  border: none;
  width: 100%;
}

.iscw {
  width: 30px;
  height: 25px;
  font-size: initial;
}

.imgs {
  width: 100%;
  height: 110px;
}

.contentWarning {
  margin-bottom: 4px;
  height: 30px;
}
</style>
