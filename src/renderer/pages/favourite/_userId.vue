<template>
  <div :style="{ width: width + 'px', height: height + 'px' }">
    <Favourite class="favourite" />
  </div>
</template>

<script>
import logger from '@/other/Logger'
import Favourite from '@/components/Favourite/Favourite'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('users')

export default {
  components: {
    Favourite
  },
  data () {
    return {
      width: 0,
      height: 0
    }
  },
  computed: {
    userId () {
      return Number(this.$route.params.userId)
    },
    screenName () {
      return String(this.$route.query.screenName)
    }
  },
  methods: {
    ...mapActions(['setCurrentUserId', 'loadUserConfig'])
  },
  created () {
    this.loadUserConfig()
    this.setCurrentUserId(this.userId)
  },
  mounted () {
    this.width = window.innerWidth
    this.height = window.innerHeight
    window.addEventListener('resize', (e) => {
      this.width = window.innerWidth
      this.height = window.innerHeight
      logger.debug(this.width, this.height)
    })
    window.addEventListener('storage', (event) => {
      if (event.key === 'user' + this.userId) {
        const val = JSON.parse(event.newValue)
        if (val.type === 'deleteToot') {
          this.removeToot({ id: val.id })
        }
      }
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', () => { })
    window.removeEventListener('storage', () => { })
  }
}
</script>

<style scoped>
.searchContainer {
  font-size: 12px;
  height: 100%;
  width: 100%;
}
.favourite {
  height: 100%;
}
</style>
