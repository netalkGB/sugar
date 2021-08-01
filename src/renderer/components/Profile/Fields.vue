<template>
  <div class="fields">
    <div
      v-for="(item, index) in fields"
      :key="index"
    >
      {{ item.name }}:
      <MastodonHTML
        :html="item.value"
        @click="handleClick"
      />
    </div>
  </div>
</template>

<script>
import MastodonHTML from '@/components/MastodonHTML/MastodonHTML'
import logger from '@/other/Logger'
const ipcRenderer = window.ipc
export default {
  components: {
    MastodonHTML
  },
  props: ['fields'],
  methods: {
    handleClick (ev) {
      const { type } = ev
      if (type === 'hashtag') {
        const { href, tag } = ev
        logger.debug('[hashtag]', href, tag)
      } else if (type === 'user') {
        const { href } = ev
        logger.debug('[user]', href)
        ipcRenderer.send('openURL', href)
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
