<template>
  <div><input v-model="query"><input
      type="button"
      @click="search"
    >{{userId}}<br>{{accounts}}<br>{{timeline}}</div>
</template>

<script>
import { mapActions, createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('search')
export default {
  props: ['userId'],
  methods: {
    ...mapActions('users', ['setCurrentUserId', 'loadUserConfig']),
    ...mapActions('search', ['searchMastodon']),
    search () {
      this.searchMastodon({ q: this.query })
    }
  },
  data () {
    return {
      query: ''
    }
  },
  mounted () {
    this.loadUserConfig()
    this.setCurrentUserId(this.userId)
  },
  computed: {
    ...mapState({ accounts: state => state.accounts, timeline: state => state.timeline })
  }
}
</script>

<style scoped>
</style>
