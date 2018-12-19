<template>
  <div style="word-wrap: break-word;">
    {{profile}}
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions, mapState } = createNamespacedHelpers('profile')

export default {
  props: ['internalId', 'userId'],
  methods: {
    ...mapActions(['fetchProfile']),
    async fetch () {
      const internalId = this.internalId
      await this.fetchProfile({ internalId })
    }
  },
  computed: {
    ...mapState({ profile: state => state.profile })
  }
}
</script>

<style scoped>
</style>
