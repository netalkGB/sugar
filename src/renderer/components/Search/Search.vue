<template>
  <div>
    <SearchBox style="height: 30px" />
    <UserList
      style="height: calc(100% - 30px);"
      :infiniteMode="false"
      :users="accounts"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import SearchBox from '@/components/Search/SearchBox'
import UserList from '@/components/TimeLine/UserList'
const { mapState } = createNamespacedHelpers('search')

export default {
  components: {
    SearchBox,
    UserList
  },
  computed: {
    ...mapState({ accounts: state => state.accounts, timeline: state => state.timeline, active: state => state.active })
  }
}
</script>

<style scoped>
</style>
