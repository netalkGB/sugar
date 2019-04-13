<template>
  <div class="searchBox">
    <input v-model="query">
    <input
      type="button"
      @click="search"
    >
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('search')

export default {
  data () {
    return {
      query: ''
    }
  },
  methods: {
    ...mapActions(['searchMastodon']),
    search () {
      console.log(this.query)
      this.searchMastodon({ q: this.query })
    }
  }
}
</script>

<style scoped>
.searchBox {
  background-color: antiquewhite;
  height: 100%;
}
</style>
