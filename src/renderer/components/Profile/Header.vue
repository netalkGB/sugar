<template>
  <div
    ref="a"
    class="headerContainer"
  >
    <div class="border">
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
      <MastodonHTML
        @click="handleClick"
        :html="profile.note"
      />
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
  </div>
</template>

<script>
import IosLockIcon from 'vue-ionicons/dist/ios-lock.vue'
import MastodonHTML from '@/components/MastodonHTML/MastodonHTML'
import logger from '@/other/Logger'
import { shell } from 'electron'
export default {
  props: ['profile'],
  components: {
    IosLockIcon,
    MastodonHTML
  },
  methods: {
    handleClick (ev) {
      const { type } = ev
      if (type === 'hashtag') {
        const { href, tag } = ev
        logger.debug('[hashtag]', href, tag)
      } else if (type === 'user') {
        const { href } = ev
        logger.debug('[user]', href)
        shell.openExternal(href)
      } else {
        const { href } = ev
        shell.openExternal(href)
      }
    }
  }
}
</script>

<style scoped>
.headerContainer {
  word-wrap: break-word;
  background-color: #fcfcfc;
}
.border {
  border-bottom: 1px solid #cccccc;
  padding: 8px;
}
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
