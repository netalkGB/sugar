<template>
  <div class="searchBox">
    <input
      class="textbox"
      type="search"
      v-model="query"
    >
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
      query: '',
      textboxWidth: 0
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
  padding-left: 4px;
  padding-right: 4px;
  display: flex;
}
.searchButton {
  height: 25px;
  width: 50px;
  margin-left: 4px;
  font-size: 11px;
}
.textbox {
  width: calc(100% - 54px);
  height: 25px;
}
::-webkit-search-cancel-button {
  color: black;
}
</style>
