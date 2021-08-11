<template>
  <div class="favourite">
    <TimeLine
      ref="timeline"
      :infinite-mode="false"
      :timeline="timeline"
    />
  </div>
</template>

<script>
import TimeLine from '@/components/TimeLine/TimeLine'
import { mapActions, mapState } from 'vuex'
import logger from '@/other/Logger'
import DialogMessage from '@/utils/DialogMessage'

export default {
  components: {
    TimeLine
  },
  computed: {
    ...mapState('favourite', { timeline: state => state.timeline })
  },
  mounted () {
    const messages = DialogMessage.getMessages('ja')
    this.fetchFavourite().catch((e) => {
      logger.error(e)
      this.showMessage({ message: messages.favoriteFetchError })
    })
  },
  methods: {
    ...mapActions('favourite', ['fetchFavourite']),
    ...mapActions('modal', ['showMessage'])
  }
}
</script>

<style scoped>
</style>
