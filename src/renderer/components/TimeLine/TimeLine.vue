<template>
  <div
    ref="outerList"
    class="timelineContainer"
    @scroll="scrolling"
  >
    <div
      ref="list"
      class="innerTimeline"
    >
      <Toot
        v-for="(toot) in timeline"
        :key="toot.id"
        :toot="toot"
      />
      <div
        v-if="loadingPrev === true"
        class="loadingicon"
      >
        <IosSyncIcon
          w="20px"
          h="20px"
          animate="rotate"
        />
      </div>
    </div>
    <Loading v-if="!firstLoadDone" />
  </div>
</template>

<script>
import Toot from '@/components/TimeLine/Toot/Toot'
import Loading from '@/components/TimeLine/Loading'
import IosSyncIcon from 'vue-ionicons/dist/ios-sync.vue'
export default {
  components: { Toot, IosSyncIcon, Loading },
  props: {
    timeline: {
      type: Array,
      required: true
    },
    infiniteMode: {
      type: Boolean,
      required: false,
      default: true
    },
    firstLoadDone: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      scrollState: 'loading(next)',
      loadingPrev: false,
      prevScrollHeight: 0
    }
  },
  watch: {
    scrollState () {
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
    this.$on('loadOldTootDone', function () {
      this.loadingPrev = false
    })
  },
  beforeDestroy () {
    this.$off('loadOldTootDone')
  },
  methods: {
    scrolling (e) {
      const { scrollTop, offsetHeight, scrollHeight } = e.target
      const loadTopHeight = scrollHeight - offsetHeight
      const ceiledScrollTop = Math.ceil(scrollTop)
      if (ceiledScrollTop <= 0) {
        this.scrollState = 'loading(next)'
      } else if (ceiledScrollTop >= loadTopHeight) {
        this.scrollState = 'loading(prev)'
      } else {
        this.scrollState = 'buffering'
      }
    }
  }
}
</script>

<style scoped>
.timelineContainer {
  position: relative;
  font-size: 12px;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.loadingicon {
  text-align: center;
  color: #00aaff;
}
</style>
