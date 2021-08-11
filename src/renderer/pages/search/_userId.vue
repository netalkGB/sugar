<template>
  <div :style="{ width: width + 'px', height: height + 'px' }">
    <Search class="searchContainer" />
    <Modal />
  </div>
</template>

<script>
import logger from '@/other/Logger'
import Search from '@/components/Search/Search'
import { createNamespacedHelpers } from 'vuex'
import Modal from '@/components/Modal/Modal'
const { mapActions } = createNamespacedHelpers('users')

export default {
  components: {
    Search,
    Modal
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
    }
  },
  created () {
    this.loadUserConfig()
    this.setCurrentUserId(this.userId)
  },
  mounted () {
    this.width = window.innerWidth
    this.height = window.innerHeight
    window.addEventListener('resize', (_event) => {
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
  },
  methods: {
    ...mapActions(['setCurrentUserId', 'loadUserConfig'])
  }
}
</script>

<style scoped>
.searchContainer {
  font-size: 12px;
  height: 100%;
  width: 100%;
}
</style>
