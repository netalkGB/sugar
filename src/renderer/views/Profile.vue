<template>
  <Profile
    :userId="userId"
    :internalId="internalId"
    ref="profile"
  />
</template>

<script>
import { mapActions } from 'vuex'
import Profile from '@/components/Profile/Profile'
export default {
  props: ['userId', 'internalId'],
  components: { Profile },
  methods: {
    ...mapActions('users', ['setCurrentUserId', 'loadUserConfig'])
  },
  async created () {
    await this.loadUserConfig()
    this.setCurrentUserId(this.userId)
    this.$refs.profile.fetch()
  }
}
</script>

<style scoped>
</style>
