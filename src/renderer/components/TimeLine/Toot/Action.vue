<template>
  <div class="actions flex">
    <div class="flex">
      <div
        class="button"
        @click="replyToot"
      >
        <IosUndoIcon
          w="17"
          h="17"
        />
      </div>
      <div class="count">
        <div>{{ repliesCount }}</div>
      </div>
    </div>
    <template v-if="visibility === 'public' || visibility === 'unlisted'">
      <div
        class="flex"
        :class="{boosted:displayBoosted}"
      >
        <div
          class="button"
          @click="boostToot"
        >
          <MdRepeatIcon
            w="17"
            h="17"
          />
        </div>
        <div class="count">
          <div v-if="displayBoostsCount > 0">
            {{ displayBoostsCount }}
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="visibility === 'private'">
      <div class="flex">
        <div class="button">
          <IosLockIcon
            w="17"
            h="17"
          />
        </div>
        <div class="count" />
      </div>
    </template>
    <template v-else>
      <div class="flex">
        <div class="button">
          <IosMailIcon
            w="17"
            h="17"
          />
        </div>
        <div class="count" />
      </div>
    </template>
    <div
      class="flex"
      :class="{favorited:displayFavorited}"
    >
      <div
        class="button"
        @click="favoriteToot"
      >
        <IosStarIcon
          w="17"
          h="17"
        />
      </div>
      <div class="count">
        <div v-if="displayFavoritesCount > 0">
          {{ displayFavoritesCount }}
        </div>
      </div>
    </div>
    <div
      v-if="isTootByOwn"
      class="flex"
    >
      <div
        class="button"
        @click="deleteToot"
      >
        <MdTrashIcon
          w="17"
          h="17"
        />
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
import MdTrashIcon from 'vue-ionicons/dist/md-trash.vue'
import { mapActions, mapGetters } from 'vuex'
import logger from '@/other/Logger'

export default {
  components: { IosUndoIcon, MdRepeatIcon, IosStarIcon, IosLockIcon, IosMailIcon, MdTrashIcon },
  props: {
    visibility: {
      type: String,
      required: true
    },
    boostsCount: {
      type: Number,
      default: 0
    },
    favoritesCount: {
      type: Number,
      default: 0
    },
    repliesCount: {
      type: Number,
      default: 0
    },
    favorited: {
      type: Boolean,
      default: false
    },
    boosted: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      required: true
    },
    userid: {
      type: String,
      required: true
    },
    isTootByOwn: {
      type: Boolean,
      require: true
    },
    mentions: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      displayBoosted: false,
      displayFavorited: false,
      displayFavoritesCount: 0,
      displayBoostsCount: 0
    }
  },
  computed: {
    ...mapGetters('users', { currentUser: 'getCurrentUser' }),
    myID () {
      return this.currentUser.user.userid
    }
  },
  created () {
    this.displayBoosted = this.boosted
    this.displayFavorited = this.favorited
    this.displayFavoritesCount = this.favoritesCount
    this.displayBoostsCount = this.boostsCount
  },
  methods: {
    deleteToot () {
      logger.debug('delete')
      this.deleteOwnToot({ id: this.id })
    },
    replyToot () {
      logger.debug('reply')
      this.reply({ inReplyToID: this.id, destinations: [this.userid, ...this.mentions.filter(m => m.acct !== this.myID).map(m => m.acct)].join(',') })
    },
    favoriteToot () {
      if (this.displayFavorited) {
        logger.debug('to unfavorite')
        this.displayFavorited = false
        this.displayFavoritesCount--
        this.unFavorite({ id: this.id }).catch((_e) => {
          this.displayFavorited = true
        })
      } else {
        logger.debug('to favorite')
        this.displayFavoritesCount++
        this.displayFavorited = true
        this.favorite({ id: this.id }).catch((_e) => {
          this.displayFavorited = false
        })
      }
    },
    boostToot () {
      if (this.displayBoosted) {
        logger.debug('to unboost')
        this.displayBoosted = false
        this.displayBoostsCount--
        this.unBoost({ id: this.id }).catch((_e) => {
          this.displayBoosted = true
        })
      } else {
        logger.debug('to boost')
        this.displayBoostsCount++
        this.displayBoosted = true
        this.boost({ id: this.id }).catch((_e) => {
          this.displayBoosted = false
        })
      }
    },
    ...mapActions('timelines', ['favorite', 'unFavorite', 'boost', 'unBoost', 'reply', 'deleteOwnToot'])
  }
}
</script>

<style scoped>
.flex {
  display: flex;
}
.actions {
  flex-wrap: wrap;
  margin-bottom: 4px;
  margin-top: 4px;
  height: 17px;
}
.favorited {
  color: #ffaa00;
}
.boosted {
  color: #0000ff;
}

.button {
  width: 17px;
  cursor: pointer;
}
.count {
  width: 32px;
  padding-left: 2px;
  font-size: 12px;
  display: flex;
  align-items: center;
}
</style>
