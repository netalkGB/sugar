<template>
  <div class="newToot">
    <div v-if="isCW" class="contentWarning">
      <input class="cw" v-model="spoilerText" :disabled="sending" placeholder="ここに警告を書いてください">
    </div>
    <textarea :value="toot" :disabled="sending" @input="handleInput" class="toot" autofocus placeholder="今何してる？"></textarea>
    <div class="menu">
      <div>
        <MtButton class="item" @click.native="addFile" :disabled="files.length >= 4 || sending">写真を追加</MtButton>
        <MtSelect class="item" :disabled="sending" v-model='visibility'>
          <option value="public">公開</option>
          <option value="unlisted">未収載</option>
          <option value="private">フォロワー限定</option>
          <option value="direct">ダイレクト</option>
        </MtSelect>
        <label class="item">
          CW:<input type="checkbox" :disabled="sending" v-model="isCW">
        </label>
      </div>
      <div>
        {{ tootLength }}
      </div>
    </div>
    <MtButton :disabled="sending || isPreparingImage" @click.native="postToot" type="submit" class="item">トゥート</MtButton>
    <Images :files="files" @removeFile="removeFile" class="imgs" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { ipcRenderer } from 'electron'
import Images from './Images'
import logger from '../../other/Logger'
import FileState from '../../other/FileState'
import File from '../../other/File'
import MtButton from '../Form/MtButton'
import MtSelect from '../Form/MtSelect'
const maxTootLength = 500
export default {
  components: {
    MtButton,
    MtSelect,
    Images
  },
  props: { userId: Number },
  methods: {
    ...mapActions('users', ['loadUserConfig', 'setCurrentUserId']),
    postToot () {
      this.sending = true
      const { accessToken, host } = this.keys
      const { isCW, toot, visibility, spoilerText, files } = this
      let params = {
        status: toot,
        visibility
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
      ipcRenderer.send('postToot', { accessToken, host, toot: params })
    },
    handleInput (e) {
      const value = e.target.value
      this.toot = value
    },
    addFile () {
      ipcRenderer.once('openDialog-success', (_, appendFile) => {
        if (appendFile !== null) {
          const filePath = appendFile[0]
          const file = File.setFile({ filePath, state: FileState.uploading })
          this.files = [...this.files, file]
          this.uploadFile(file)
        }
      })
      ipcRenderer.send('openDialog')
    },
    uploadFile (file) {
      const { accessToken, host } = this.keys
      const { filePath, uuid } = file
      ipcRenderer.send('uploadFile', { accessToken, host, filePath, uuid })
    },
    removeFile (idx) {
      this.files = this.files.filter((val, index) => idx !== index)
    },
    clearForm () {
      this.toot = ''
      this.spoilerText = ''
      this.spoilerText = ''
      this.files = []
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
      sending: false
    }
  },
  watch: {
    isCW (newVal) {
      if (newVal === false) {
        this.spoilerText = ''
      }
      this.$emit('requireHeightChange', { cw: newVal, fileList: this.files.length > 0 })
    },
    files (newVal) {
      this.$emit('requireHeightChange', { cw: this.isCW, fileList: newVal.length > 0 })
    }
  },
  computed: {
    tootLength () {
      return maxTootLength - this.toot.length
    },
    isPreparingImage () {
      return this.files.find(val => val.state === 'error' || val.state === 'uploading') !== undefined
    }
  },
  async created () {
    await this.loadUserConfig()
    this.setCurrentUserId(this.userId)
    const { accessToken, host } = this.$store.getters['users/getCurrentUser']
    this.keys.accessToken = accessToken
    this.keys.host = host
    ipcRenderer.addListener('postToot-success', (e, m) => {
      const { host, accessToken, result } = m
      if (host !== this.keys.host && accessToken !== this.keys.accessToken) {
        return
      }
      if (result.resp.statusCode === 200) {
        this.clearForm()
      }
      this.sending = false
    })
    ipcRenderer.addListener('postToot-error', (e, m) => {
      const { host, accessToken, error } = m
      if (host !== this.keys.host && accessToken !== this.keys.accessToken) {
        return
      }
      this.sending = false
      logger.error(error)
    })
    ipcRenderer.addListener('uploadFile-success', (e, m) => {
      const { host, accessToken, result, uuid } = m
      if (host !== this.keys.host && accessToken !== this.keys.accessToken) {
        return
      }
      if (this.files.find(val => val.uuid === uuid) === null) {
        return
      }
      if (result.resp.statusCode === 200) {
        const id = result.data.id
        this.files = this.files.map((val) => val.uuid === uuid ? val.changeState({ newState: FileState.done, id }) : val)
      } else {
        this.files = this.files.map((val) => val.uuid === uuid ? val.changeState({ newState: FileState.error, id: null }) : val)
        logger.error(result)
      }
    })
    ipcRenderer.addListener('uploadFile-error', (e, m) => {
      const { host, accessToken, error, uuid } = m
      if (host !== this.keys.host && accessToken !== this.keys.accessToken) {
        return
      }
      if (this.files.find(val => val.uuid === uuid) === null) {
        return
      }
      this.files = this.files.map((val) => val.uuid === uuid ? { ...val, state: FileState.error } : val)
      logger.error(error)
    })
  },
  destroyed () {
    ipcRenderer.removeListener('openDialog-success', () => { })
    ipcRenderer.removeListener('postToot-success', () => { })
    ipcRenderer.removeListener('postToot-error', () => { })
    ipcRenderer.removeListener('uploadFile-success', () => { })
    ipcRenderer.removeListener('uploadFile-error', () => { })
  }
}
</script>

<style scoped>
.newToot {
  background-color: #eeeeee;
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
.menu {
  display: flex;
  justify-content: space-between;
}

.item {
  height: 24px;
}

.cw {
  border: none;
  width: 100%;
}

.imgs {
  width: 100%;
  margin-top: 8px;
}

.contentWarning {
  margin-bottom: 4px;
}
</style>
