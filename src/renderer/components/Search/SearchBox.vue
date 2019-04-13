<template>
  <div class="searchBox">
    <input v-model="query">
    <MtButton
      @click.native="search"
      type="submit"
      :disabled="query.length <= 0"
      class="searchButton"
    >検索</MtButton>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import MtButton from '@/components/Form/MtButton'
const { mapActions } = createNamespacedHelpers('search')

export default {
  components: {
    MtButton
  },
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
  height: 100%;
}
.searchButton {
  height: 25px;
  font-size: 11px;
}
</style>
