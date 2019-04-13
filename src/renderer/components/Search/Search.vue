<template>
  <div>
    <SearchBox style="height: 30px"/>
    <div style="height: calc(100% - 30px);overflow:scroll;">
      {{accounts}}<br>{{timeline}}
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import SearchBox from '@/components/Search/SearchBox'
const { mapState } = createNamespacedHelpers('search')

export default {
  components: {
    SearchBox
  },
  computed: {
    ...mapState({ accounts: state => state.accounts, timeline: state => state.timeline, active: state => state.active })
  }
}
</script>

<style scoped>
</style>
