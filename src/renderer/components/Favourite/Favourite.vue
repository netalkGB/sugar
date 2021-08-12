<template>
  <div class="favourite">
    <TimeLine
      ref="timeline"
      :infinite-mode="false"
      :timeline="timeline"
      :first-load-done="firstTimelineLoadDone"
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
  data () {
    return {
      firstTimelineLoadDone: false
    }
  },
  computed: {
    ...mapState('favourite', { timeline: state => state.timeline })
  },
  mounted () {
    const messages = DialogMessage.getMessages('ja')
    this.fetchFavourite().catch((e) => {
      logger.error(e)
      this.showMessage({ message: messages.favoriteFetchError })
    }).finally(() => {
      this.firstTimelineLoadDone = true
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
