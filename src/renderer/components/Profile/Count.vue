<template>
  <div class="countContainer">
    <div
      class="status"
      @click="toggle('status')"
    >
      <div class="title">トゥート</div>
      <div class="count">{{toot}}</div>
    </div>
    <div
      class="following"
      @click="toggle('following')"
    >
      <div class="title">フォロー</div>
      <div class="count">{{following}}</div>
    </div>
    <div
      class="followers"
      @click="toggle('followers')"
    >
      <div class="title">フォロワー</div>
      <div class="count">{{follower}}</div>
    </div>
    <div class="other"></div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('profile')

export default {
  props: ['follower', 'following', 'toot'],
  data () {
    return {
      lastClickCountType: 'status',
      isFirstToggle: true
    }
  },
  methods: {
    ...mapActions(['toggleListType']),
    toggle (type) {
      this.toggleListType({ type })
      if (this.lastClickCountType === type || this.isFirstToggle) {
        this.$emit('toggle')
      }
      this.isFirstToggle = false
      this.lastClickCountType = type
    }
  }
}
</script>

<style scoped>
.countContainer {
  display: grid;
  grid-template:
    "statuse following follower other" 30px
    / 70px 70px 70px 1fr;
  padding-bottom: 2px;
  padding-top: 2px;
}
.count {
  align-items: center;
  padding-left: 2px;
}
.title {
  font-size: 70%;
}
.status,
.following,
.followers {
  cursor: pointer;
}
</style>
