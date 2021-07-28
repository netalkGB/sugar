<template>
  <MastodonHTML
    @click="handleClick"
    :html="content"
  />
</template>

<script>
import { mapActions } from 'vuex'
import logger from '@/other/Logger'
import MastodonHTML from '@/components/MastodonHTML/MastodonHTML'
const ipcRenderer = window.ipc

export default {
  props: ['content', 'mentions'],
  components: {
    MastodonHTML
  },
  data () {
    return {
      users: null,
      hashtags: null,
      links: null,
      atag: null
    }
  },
  methods: {
    ...mapActions('timelines', ['profile']),
    handleClick (ev) {
      const { type } = ev
      if (type === 'hashtag') {
        const { href, tag } = ev
        logger.debug('[hashtag]', href, tag)
        ipcRenderer.send('openURL', href)
      } else if (type === 'user') {
        const { href } = ev
        logger.debug('[user]', href)
        if (this.mentions) {
          const mention = this.mentions.find(m => m.url === href)
          if (mention) {
            this.profile({ internalid: mention.id })
          }
        } else {
          ipcRenderer.send('openURL', href)
        }
      } else {
        const { href } = ev
        ipcRenderer.send('openURL', href)
      }
    }
  }
}
</script>

<style scoped>
</style>
