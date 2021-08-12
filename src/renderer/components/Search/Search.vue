<template>
  <div>
    <div class="line">
      <SearchBox style="height: 26px;padding: 4px;" @startFetch="startFetch" @endFetch="endFetch" />
    </div>
    <UserList
      style="height: calc(100% - 35px);"
      :infinite-mode="false"
      :users="accounts"
      :first-load-done="firstUserListLoadDone"
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
  data () {
    return {
      userListLoading: false
    }
  },
  computed: {
    ...mapState({ accounts: state => state.accounts, timeline: state => state.timeline, active: state => state.active }),
    firstUserListLoadDone () {
      return !this.userListLoading
    }
  },
  methods: {
    startFetch () {
      this.userListLoading = true
    },
    endFetch () {
      this.userListLoading = false
    }
  }
}
</script>

<style scoped>
.line {
  border-bottom: 1px solid #cccccc;
  padding: 0px;
}

</style>
