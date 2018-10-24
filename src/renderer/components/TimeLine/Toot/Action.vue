<template>
  <div class="actions flex" >
    <div class="reply flex" @click="replyToot">
      <IosUndoIcon :w="'18'" :h="'18'"/>
      <div class="count">{{repliesCount}}</div>
    </div>
    <template v-if="visibility === 'public' || visibility === 'unlisted'">
      <div class="action flex" :class="{boosted:displayBoosted}" @click="boostToot">
        <MdRepeatIcon :w="'18'" :h="'18'" />
        <div class="count">
          <span v-if="displayBoostsCount > 0">
            {{displayBoostsCount}}
          </span>
        </div>
      </div>
    </template>
    <template v-else-if="visibility === 'private'">
      <div class="action flex">
        <IosLockIcon :w="'18'" :h="'18'" />
        <div class="count"></div>
      </div>
    </template>
    <template v-else>
      <div class="action flex">
        <IosMailIcon :w="'18'" :h="'18'" />
        <div class="count"></div>
      </div>
    </template>
    <div class="action flex" :class="{favorited:displayFavorited}" @click="favoriteToot">
      <IosStarIcon :w="'18'" :h="'18'" />
      <div class="count">
        <span v-if="displayFavoritesCount > 0">{{displayFavoritesCount}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import IosUndoIcon from 'vue-ionicons/dist/ios-undo.vue'
import MdRepeatIcon from 'vue-ionicons/dist/md-repeat.vue'
import IosStarIcon from 'vue-ionicons/dist/ios-star.vue'
import IosLockIcon from 'vue-ionicons/dist/ios-lock.vue'
import IosMailIcon from 'vue-ionicons/dist/ios-mail.vue'
import { mapActions } from 'vuex'
import logger from '../../../other/Logger'

export default {
  components: { IosUndoIcon, MdRepeatIcon, IosStarIcon, IosLockIcon, IosMailIcon },
  props: ['visibility', 'boostsCount', 'favoritesCount', 'repliesCount', 'favorited', 'boosted', 'id', 'userid'],
  data () {
    return {
      displayBoosted: false,
      displayFavorited: false,
      displayFavoritesCount: 0,
      displayBoostsCount: 0
    }
  },
  created () {
    this.displayBoosted = this.boosted
    this.displayFavorited = this.favorited
    this.displayFavoritesCount = this.favoritesCount
    this.displayBoostsCount = this.boostsCount
  },
  methods: {
    replyToot () {
      logger.debug('reply')
      this.reply({ inReplyToID: this.id, destination: this.userid })
    },
    favoriteToot () {
      if (this.displayFavorited) {
        logger.debug('to unfavorite')
        this.displayFavorited = false
        this.displayFavoritesCount--
        this.unFavorite({ id: this.id }).catch((e) => {
          this.displayFavorited = true
        })
      } else {
        logger.debug('to favorite')
        this.displayFavoritesCount++
        this.displayFavorited = true
        this.favorite({ id: this.id }).catch((e) => {
          this.displayFavorited = false
        })
      }
    },
    boostToot () {
      if (this.displayBoosted) {
        logger.debug('to unboost')
        this.displayBoosted = false
        this.displayBoostsCount--
        this.unBoost({ id: this.id }).catch((e) => {
          this.displayBoosted = true
        })
      } else {
        logger.debug('to boost')
        this.displayBoostsCount++
        this.displayBoosted = true
        this.boost({ id: this.id }).catch((e) => {
          this.displayBoosted = false
        })
      }
    },
    ...mapActions('timelines', ['favorite', 'unFavorite', 'boost', 'unBoost', 'reply'])
  }
}
</script>

<style scoped>
.flex {
  display: flex;
}
.actions {
  flex-wrap: wrap;
  margin: 4px 0;
}
.favorited {
  color: #ffaa00;
}
.boosted {
  color: #0000ff;
}

.action {
  cursor: pointer;
}
.count {
  width: 32px;
}
</style>
