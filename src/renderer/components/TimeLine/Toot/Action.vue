<template>
  <div id="action">
    <div id="reply"><IosUndoIcon :w="'18'" :h="'18'" /> <div class="count">{{repliesCount}}</div></div>
    <template v-if="visibility === 'public' || visibility === 'unlisted'">
      <div id="boost" :class="{boosted:displayBoosted}" @click="boostToot">
        <MdRepeatIcon :w="'18'" :h="'18'" />
        <div class="count">
          <span v-if="displayBoostsCount > 0">
            {{displayBoostsCount}}
          </span>
        </div>
      </div>
    </template>
    <template v-else-if="visibility === 'private'">
      <div id="protectedboost">
        <IosLockIcon :w="'18'" :h="'18'" />
        <div class="count"></div>
      </div>
    </template>
    <template v-else>
      <div id="dmboost">
        <IosMailIcon :w="'18'" :h="'18'" />
        <div class="count"></div>
      </div>
    </template>
    <div id="favorite" :class="{favorited:displayFavorited}" @click="favoriteToot">
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
  props: ['visibility', 'boostsCount', 'favoritesCount', 'repliesCount', 'favorited', 'boosted', 'id'],
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
    favoriteToot () {
      if (this.displayFavorited) {
        logger.debug('to unfavorite')
        this.displayFavorited = false
        this.displayFavoritesCount--
        this.unFavorite({ id: this.id }).catch((e) => {
          this.displayFavorited = true
          // this.displayFavoritesCount++
        })
      } else {
        logger.debug('to favorite')
        this.displayFavoritesCount++
        this.displayFavorited = true
        this.favorite({ id: this.id }).catch((e) => {
          this.displayFavorited = false
          // this.displayFavoritesCount--
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
          // this.displayBoostsCount++
        })
      } else {
        logger.debug('to boost')
        this.displayBoostsCount++
        this.displayBoosted = true
        this.boost({ id: this.id }).catch((e) => {
          this.displayBoosted = false
          // this.displayBoostsCount--
        })
      }
    },
    ...mapActions('timelines', ['favorite', 'unFavorite', 'boost', 'unBoost'])
  }
}
</script>

<style scoped>
#action {
  display: flex;
  flex-wrap: wrap;
  margin: 4px 0;
}
.favorited {
  color: #ffaa00;
}
.boosted {
  color: #0000ff;
}

#reply,
#boost,
#favorite,
#protectedboost,
#dmboost {
  display: flex;
  cursor: pointer;
  /* color: #bbbbbb; */
}
.count {
  width: 32px;
}
</style>
