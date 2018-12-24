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
        <div
          class="profileBg"
          :style="profile.header ? { background: `#fcfcfc url(${profile.header}) no-repeat center center`} : {}"
        >
          <div class="profileFg">
            <div
              class="imageContainer"
              v-if="shortMode === false"
            >
              <div
                class="image"
                @click="toggleShortMode"
              >
                <img
                  class="img"
                  :src="profile.avatar"
                  width="40"
                  height="40"
                >
              </div>
            </div>
            <div class="idnameContainer">
              <div
                class="idname"
                @click="toggleShortMode"
              >
                <span class="id">{{profile.displayName}}</span>
                <IosLockIcon
                  :w="'12'"
                  :h="'12'"
                  v-if="profile.locked"
                />
              </div>
              <div
                class="idname"
                @click="toggleShortMode"
              >{{profile.userid}}</div>
            </div>
            <div class="paddingLR">
              <MastodonHTML
                @click="handleClick"
                :html="profile.note"
                v-if="shortMode === false"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="countContainer paddingLR">
        <div
          class="status"
          @click="toggleShortMode"
        >
          <div class="title">トゥート</div>
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
  data () {
    return {
      shortMode: false
    }
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
    },
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
.count {
  padding-left: 2px;
}
.imageContainer {
  padding-top: 4px;
  height: calc(100% / 2);
  display: flex;
  justify-content: center;
  align-items: center;
}
.image {
  cursor: pointer;
}
.img {
  cursor: pointer;
  border-radius: 2px;
  pointer-events: none;
}
.idnameContainer {
  height: calc(100% / 2);
}
.idname {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.status {
  cursor: pointer;
}
.id {
  font-weight: bolder;
}
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
}
.title {
  font-size: 70%;
}
</style>
