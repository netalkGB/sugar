<template>
  <div
    class="headerContainer"
  >
    <div class="border">
      <div
        class="header"
        ref="header"
      >
        <div
          class="profileBg"
          :style="profile.header ? { background: `#fcfcfc url(${profile.header}) no-repeat center center`} : {}"
        >
          <ProfileFg
            class="profileFg"
            :shortMode="shortMode"
            :avatar="profile.avatar"
            :displayName="profile.displayName"
            :locked="profile.locked"
            :bot="profile.bot"
            :userid="profile.userid"
            :note="profile.note"
            :fields="profile.fields"
            :isFollowing="profile.isFollowing"
            :isFollower="profile.isFollower"
            @toggle="toggleShortMode"
          />
        </div>
      </div>
      <Count
        class="paddingLR"
        :follower="profile.followersCount"
        :following="profile.followingCount"
        :toot="profile.statusesCount"
        @toggle="toggleShortMode"
      />
    </div>
  </div>
</template>

<script>
import IosLockIcon from 'vue-ionicons/dist/ios-lock.vue'
import Count from '@/components/Profile/Count'
import ProfileFg from '@/components/Profile/ProfileFg'

export default {
  props: ['profile'],
  components: {
    IosLockIcon,
    Count,
    ProfileFg
  },
  data () {
    return {
      shortMode: false
    }
  },
  methods: {
    toggleShortMode () {
      this.shortMode = !this.shortMode
      this.$nextTick(function () {
        this.$emit('wantRecalculateHeight')
      })
    }
  }
}
</script>

<style scoped>
.profileBg {
  width: 100%;
  height: 100%;
  background-size: cover;
}
.profileFg {
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.85);
  color: #333;
  border-bottom: 1px solid #cccccc;
  padding-bottom: 2px;
}
.paddingLR {
  padding-left: 8px;
  padding-right: 8px;
}
.headerContainer {
  word-wrap: break-word;
  background-color: #fcfcfc;
}
.header {
  background-size: cover;
}
.border {
  border-bottom: 1px solid #cccccc;
}
</style>
