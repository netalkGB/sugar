<template>
  <div class="newToot">
    <textarea :value="toot" @input="handleInput" class="toot" autofocus placeholder="今何してる？"></textarea>
    <div v-if="isCW" class="contentWarning">
      <input value="" placeholder="ここに警告を書いてください">
    </div>
    <div class="menu">
      <div>
        <button @click="addFile" :disabled="files.length >= 4">写真を追加</button>
        <select>
          <option value="public">公開</option>
          <option value="unlisted">未収載</option>
          <option value="private">フォロワー限定</option>
          <option value="direct">ダイレクト</option>
        </select>
        <label>
          CW:<input type="checkbox" v-model="isCW">
        </label>
      </div>
      <div>
        {{ tootLength }}
      </div>
    </div>
    <button>トゥート</button>
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
const maxTootLength = 500
export default {
  props: { userId: Number },
  methods: {
    ...mapActions('users', ['loadUserConfig', 'setCurrentUserId']),
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
    }
  },
  data () {
    return {
      toot: '',
      maxTootLength,
      isCW: false,
      files: []
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
    logger.debug(this.$store.getters['users/getCurrentUser'])
  },
  destroyed () {
    ipcRenderer.removeListener('openDialog-success', () => { })
  }
}
</script>

<style scoped>
.newToot {
  padding: 4px;
  width: calc(100% - 8px);
}
.toot {
  border: none;
  width: calc(100% - 8px);
  height: 50px;
  padding: 4px;
  margin: 0;
  resize: none;
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
</style>
