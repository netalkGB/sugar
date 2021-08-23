<template>
  <div :style="{ width: width + 'px', height: height + 'px' }">
    <Settings />
    <Modal />
  </div>
</template>

<script>
import logger from '@/other/Logger'
import { createNamespacedHelpers } from 'vuex'
import Settings from '@/components/Settings/Settings'
import Modal from '@/components/Modal/Modal'

const { mapActions } = createNamespacedHelpers('users')

export default {
  components: {
    Modal,
    Settings
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

</style>
