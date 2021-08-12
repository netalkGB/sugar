<template>
  <div
    class="headerContainer"
  >
    <div class="border">
      <div
        ref="header"
        class="header"
      >
        <div
          class="profileBg"
          :style="profile.header ? { background: `#fcfcfc url(${profile.header}) no-repeat center center`} : {}"
        >
          <ProfileFg
            class="profileFg"
            :short-mode="shortMode"
            :avatar="profile.avatar"
            :display-name="profile.displayName"
            :locked="profile.locked"
            :bot="profile.bot"
            :userid="profile.userid"
            :note="profile.note"
            :fields="profile.fields"
            :is-following="profile.isFollowing"
            :is-follower="profile.isFollower"
            @toggle="toggleShortMode"
          />
        </div>
      </div>
      <Count
        class="paddingLR"
        :follower="followersCount"
        :following="followingCount"
        :toot="tootCount"
        @toggle="toggleShortMode"
      />
    </div>
  </div>
</template>

<script>
import Count from '@/components/Profile/Count'
import ProfileFg from '@/components/Profile/ProfileFg'

export default {
  components: {
    Count,
    ProfileFg
  },
  props: {
    profile: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      shortMode: false
    }
  },
  computed: {
    followersCount () {
      const followersCount = this.profile.followersCount
      const radix = 10
      return followersCount.toString(radix)
    },
    followingCount () {
      const followingCount = this.profile.followingCount
      const radix = 10
      return followingCount.toString(radix)
    },
    tootCount () {
      const statusesCount = this.profile.statusesCount
      const radix = 10
      return statusesCount.toString(radix)
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
