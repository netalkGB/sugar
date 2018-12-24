<template>
  <div :style="{ width: width + 'px', height: height + 'px' }">
    <Profile
      class="profileContainer"
      :userId="userId"
      :internalId="internalId"
      ref="profile"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Profile from '@/components/Profile/Profile'
import logger from '@/other/Logger'
export default {
  props: ['userId', 'internalId'],
  components: { Profile },
  data () {
    return {
      width: 0,
      height: 0
    }
  },
  methods: {
    ...mapActions('users', ['setCurrentUserId', 'loadUserConfig']),
    ...mapActions('profile', ['removeToot'])
  },
  async created () {
    await this.loadUserConfig()
    this.setCurrentUserId(this.userId)
    this.$refs.profile.fetch()
    window.addEventListener('storage', event => {
      if (event.key === 'user' + this.userId) {
        const val = JSON.parse(event.newValue)
        if (val.type === 'deleteToot') {
          this.removeToot({ id: val.id })
        }
      }
    })
  },
  mounted () {
    this.width = window.innerWidth
    this.height = window.innerHeight
    window.addEventListener('resize', e => {
      this.width = window.innerWidth
      this.height = window.innerHeight
      logger.debug(this.width, this.height)
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', () => { })
    window.removeEventListener('storage', () => { })
  }
}
</script>

<style scoped>
.profileContainer {
  font-size: 12px;
  height: 100%;
  width: 100%;
}
</style>
