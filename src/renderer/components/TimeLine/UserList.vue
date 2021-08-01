<template>
  <div ref="outerList" class="userListContainer" @scroll="scrolling">
    <div ref="list">
      <User v-for="(user) in users" :key="user.id" :user="user" />
      <div v-if="loadingPrev === true" class="loading">
        <IosSyncIcon w="20px" h="20px" animate="rotate" />
      </div>
    </div>
  </div>
</template>

<script>
import User from '@/components/TimeLine/Toot/User'
import IosSyncIcon from 'vue-ionicons/dist/ios-sync.vue'
export default {
  components: { User, IosSyncIcon },
  props: {
    users: {
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
            this.$emit('wantOldUser', { maxID: this.user[this.user.length - 1].id })
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
    this.$on('loadOldUserDone', function (result) {
      this.loadingPrev = false
    })
  },
  beforeDestroy () {
    this.$off('loadOldUserDone')
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
  }
}
</script>

<style scoped>
.userListContainer {
  font-size: 12px;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.loading {
  text-align: center;
  fill: #00aaff;
}
</style>
