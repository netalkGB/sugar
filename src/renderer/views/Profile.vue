<template>
  <Profile
    :userId="userId"
    :internalId="internalId"
  />
</template>

<script>
import Profile from '@/components/Profile/Profile'
export default {
  props: ['userId', 'internalId'],
  components: { Profile }
}
</script>

<style scoped>
</style>
