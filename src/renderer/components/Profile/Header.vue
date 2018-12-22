<template>
  <div class="headerContainer">
    <div
      class="header"
      ref="header"
    >
      <div class="imageContainer">
        <img
          :src="profile.avatar"
          width="40"
          height="40"
        >
      </div>
      <div class="idnameContainer">
        <div class="idname">{{profile.displayName}}
          <IosLockIcon
            :w="'12'"
            :h="'12'"
            v-if="profile.locked"
          />
        </div>
        <div class="idname">{{profile.userid}}</div>
      </div>
    </div>
    <div
      class="note"
      v-html="profile.note"
    ></div>
    <div class="countContainer">
      <div class="status">
        <div class="title">ツイート</div>
        <div class="count">{{profile.statusesCount}}</div>
      </div>
      <div class="following">
        <div class="title">フォロー</div>
        <div class="count">{{profile.followingCount}}</div>
      </div>
      <div class="followers">
        <div class="title">フォロワー</div>
        <div class="count">{{profile.followersCount}}</div>
      </div>
      <div class="other"></div>
    </div>
  </div>
</template>

<script>
import IosLockIcon from 'vue-ionicons/dist/ios-lock.vue'
export default {
  props: ['profile'],
  components: {
    IosLockIcon
  }
}
</script>

<style scoped>
.imageContainer {
  height: calc(100% / 2);
  display: flex;
  justify-content: center;
  align-items: center;
}
.idnameContainer {
  height: calc(100% / 2);
}
.idname {
  display: flex;
  justify-content: center;
  align-items: center;
}
.countContainer {
  display: grid;
  grid-template:
    "statuse following follower other" 30px
    / 70px 70px 70px 1fr;
}
.count {
  align-items: center;
}
.title {
  font-size: 70%;
}
</style>
