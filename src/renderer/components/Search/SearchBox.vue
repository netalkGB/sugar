<template>
  <div class="searchBox">
    <MtTextBox
      class="textbox"
      type="search"
      v-model="query"
      placeholder="idまたはユーザ名"
      @cleared="clearList"
    />
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
import MtTextBox from '@/components/Form/MtTextBox'
const { mapActions } = createNamespacedHelpers('search')

export default {
  components: {
    MtButton,
    MtTextBox
  },
  data () {
    return {
      query: '',
      textboxWidth: 0
    }
  },
  methods: {
    ...mapActions(['searchMastodon', 'clearSearchList']),
    search () {
      this.searchMastodon({ q: this.query })
    },
    clearList () {
      this.clearSearchList()
    }
  }
}
</script>

<style scoped>
.searchBox {
  height: 100%;
  display: flex;
}
.searchButton {
  height: 22px;
  width: 50px;
  margin-left: 4px;
  font-size: 10px;
}
.textbox {
  width: calc(100% - 54px);
  height: 20px;
}
::-webkit-search-cancel-button {
  color: black;
}
</style>
