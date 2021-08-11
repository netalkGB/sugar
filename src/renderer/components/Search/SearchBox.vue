<template>
  <div class="searchBox">
    <MtTextBox
      v-model="query"
      class="textbox"
      type="search"
      placeholder="idまたはユーザ名"
      @cleared="clearList"
    />
    <MtButton
      type="submit"
      :disabled="query.length <= 0"
      class="searchButton"
      @click.native="search"
    >
      検索
    </MtButton>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import MtButton from '@/components/Form/MtButton'
import MtTextBox from '@/components/Form/MtTextBox'
import DialogMessage from '@/utils/DialogMessage'
import logger from '@/other/Logger'

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
    ...mapActions('search', ['searchMastodon', 'clearSearchList']),
    ...mapActions('modal', ['showMessage']),
    search () {
      this.searchMastodon({ q: this.query }).catch((e) => {
        const messages = DialogMessage.getMessages('ja')
        logger.error(e)
        this.showMessage({ message: messages.searchResultFetchError })
      })
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
