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
  components: { Profile },
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
    internalId () {
      return String(this.$route.params.internalId)
    }
  },
  methods: {
    ...mapActions('users', ['setCurrentUserId', 'loadUserConfig']),
    ...mapActions('profile', ['removeToot'])
  },
  created () {
    this.loadUserConfig()
    this.setCurrentUserId(this.userId)
  },
  mounted () {
    this.$refs.profile.fetch()
    this.width = window.innerWidth
    this.height = window.innerHeight
    window.addEventListener('resize', e => {
      this.width = window.innerWidth
      this.height = window.innerHeight
      logger.debug(this.width, this.height)
    })
    window.addEventListener('storage', event => {
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
.profileContainer {
  font-size: 12px;
  height: 100%;
  width: 100%;
}
</style>
