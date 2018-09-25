<template>
  <div class="timelineContainer" @scroll="scrolling" ref="outerList">
    <div class="innerTimeline" ref="list">
      <Toot v-for="(toot) in timeline" :toot="toot" :key="toot.id"/>
      <div v-if="loadingPrev === true">Loading...</div>
    </div>
  </div>
</template>

<script>
import Toot from './Toot/Toot'
export default {
  components: { Toot },
  props: ['timeline', 'type'],
  data () {
    return {
      scrollState: 'loading(next)',
      loadingPrev: false,
      prevScrollHeight: 0
    }
  },
  methods: {
    scrolling (e) {
      const { scrollTop, offsetHeight, scrollHeight } = e.target
      const loadTopHeight = scrollHeight - offsetHeight
      if (scrollTop <= 0) {
        this.scrollState = 'loading(next)'
      } else if (scrollTop >= loadTopHeight) {
        this.scrollState = 'loading(prev)'
      } else {
        this.scrollState = 'buffering'
      }
    }
  },
  watch: {
    scrollState: function () {
      switch (this.scrollState) {
        case 'loading(next)':
          break
        case 'loading(prev)':
          if (this.loadingPrev === false) {
            this.$emit('wantOldToot', { maxID: this.timeline[this.timeline.length - 1].id })
            this.loadingPrev = true
          }
          break
        case 'buffering':
          this.prevScrollHeight = this.$refs.list.scrollHeight
          break
      }
    }
  },
  created () {
    this.$on('loadOldTootDone', function (result) {
      this.loadingPrev = false
    })
  },
  destroyed () {
    this.$off('loadOldTootDone')
  }
}
</script>

<style scoped>
.timelineContainer {
  font-size: 12px;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
</style>
