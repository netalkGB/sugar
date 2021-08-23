<template>
  <div class="settings">
    <div>
      <h1>設定</h1>
      <article>
        <MtButton
          @click.native="clickDestoroySettingButton"
        >
          💣設定を初期化する
        </MtButton>
        <div v-if="showDestroyConfirm">
          本当に？
          <MtButton
            @click.native="destroySettings"
          >
            💣本当に設定を初期化する
          </MtButton>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import MtButton from '@/components/Form/MtButton'
import DialogMessage from '@/utils/DialogMessage'

export default {
  components: {
    MtButton
  },
  data () {
    return {
      showDestroyConfirm: false
    }
  },
  methods: {
    clickDestoroySettingButton () {
      this.showDestroyConfirm = true
    },
    destroySettings () {
      this.destroyMtSettings()
      const messages = DialogMessage.getMessages('ja')
      this.showMessage({ message: messages.requiredToReflectConfigRestartApp })
    },
    ...mapActions('settings', ['destroyMtSettings']),
    ...mapActions('modal', ['showMessage'])
  }
}
</script>

<style scoped>
.settings {
  padding: 8px;
}
</style>
