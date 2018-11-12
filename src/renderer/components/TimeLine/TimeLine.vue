<template>
  <div class="timelineContainer" @scroll="scrolling" ref="outerList">
    <div class="innerTimeline" ref="list">
      <Toot v-for="(toot) in timeline" :toot="toot" :key="toot.id" />
      <div v-if="loadingPrev === true" class="loading">
        <IosSyncIcon w="20px" h="20px" animate="rotate" />
      </div>
    </div>
  </div>
</template>

<script>
import Toot from '@/components/TimeLine/Toot/Toot'
import IosSyncIcon from 'vue-ionicons/dist/ios-sync.vue'
export default {
  components: { Toot, IosSyncIcon },
  props: {
    timeline: {
      type: Array,
      required: true
    },
    infiniteMode: {
      type: Boolean,
      required: false,
      default: true
    }
  },
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
      if (this.infiniteMode === false) {
        return
      }
      switch (this.scrollState) {
        case 'loading(next)':
          break
        case 'loading(prev)':
          if (this.loadingPrev === false) {
            this.loadingPrev = true
            this.$emit('wantOldToot', { maxID: this.timeline[this.timeline.length - 1].id })
          }
          break
        case 'buffering':
          this.prevScrollHeight = this.$refs.list.scrollHeight
          break
      }
      this.$emit('scrollStateChanged', this.scrollState)
    }
  },
  created () {
    this.$on('loadOldTootDone', function (result) {
      this.loadingPrev = false
    })
  },
  beforeDestroy () {
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
.loading {
  text-align: center;
  color: #00aaff;
}
</style>
