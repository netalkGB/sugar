<template>
  <div :style="{ width: width + 'px', height: height + 'px' }">
    <Profile
      ref="profile"
      class="profileContainer"
      :user-id="userId"
      :internal-id="internalId"
    />
    <Modal />
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Profile from '@/components/Profile/Profile'
import logger from '@/other/Logger'
import Modal from '@/components/Modal/Modal'

export default {
  components: { Profile, Modal },
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
  created () {
    this.loadUserConfig()
    this.setCurrentUserId(this.userId)
  },
  mounted () {
    this.$refs.profile.fetch()
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
    ...mapActions('users', ['setCurrentUserId', 'loadUserConfig']),
    ...mapActions('profile', ['removeToot'])
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
