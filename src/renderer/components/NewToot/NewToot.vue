<template>
  <div class="newToot">
    <div v-if="isCW" class="contentWarning">
      <input v-model="spoilerText" placeholder="ここに警告を書いてください">
    </div>
    <textarea :value="toot" @input="handleInput" class="toot" autofocus placeholder="今何してる？"></textarea>
    <div class="menu">
      <div>
        <MtButton @Click.native="addFile" :disabled="files.length >= 4">写真を追加</MtButton>
        <MtSelect v-model='visibility'>
          <option value="public">公開</option>
          <option value="unlisted">未収載</option>
          <option value="private">フォロワー限定</option>
          <option value="direct">ダイレクト</option>
        </MtSelect>
        <label>
          CW:<input type="checkbox" v-model="isCW">
        </label>
      </div>
      <div>
        {{ tootLength }}
      </div>
    </div>
    <MtButton :disabled="sending" @click.native="postToot" type="submit">トゥート</MtButton>
    <div v-if="files.length > 0" class="imgs">
      <div class="item" v-for="(file,idx) in files" :key="idx">
        <div @click="removeFile(idx)">x</div>
        <div>{{file}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { ipcRenderer } from 'electron'
import logger from '../../other/Logger'
import MtButton from '../Form/MtButton'
import MtSelect from '../Form/MtSelect'
const maxTootLength = 500
export default {
  components: {
    MtButton,
    MtSelect
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
          this.files = [...this.files, ...appendFile]
        }
      })
      ipcRenderer.send('openDialog')
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
    },
    visibility (newVal) {
      logger.debug(newVal)
    }
  },
  computed: {
    tootLength () {
      return maxTootLength - this.toot.length
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
      logger.debug('postToot-success', result)
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
  },
  destroyed () {
    ipcRenderer.removeListener('openDialog-success', () => { })
    ipcRenderer.removeListener('postToot-success', () => { })
    ipcRenderer.removeListener('postToot-error', () => { })
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
}
.menu {
  display: flex;
  justify-content: space-between;
}
.item {
  display: flex;
}
.imgs {
  width: 300px;
}
.contentWarning {
  margin-bottom: 4px;
}
</style>
