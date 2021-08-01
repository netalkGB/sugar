<template>
  <div v-if="!toot.followedBy">
    <BoostedBy
      v-if="toot.boostedBy"
      :boosted-by="toot.boostedBy"
      class="notification"
      @click="openProfile(toot.boostedBy)"
    />
    <FavoritedBy
      v-if="toot.favoritedBy"
      :favorited-by="toot.favoritedBy"
      class="notification"
      @click="openProfile(toot.favoritedBy)"
    />
    <div class="toot">
      <ProfileImage
        :profile="toot.profile"
        @click="openProfile(toot.profile)"
      />
      <div class="body">
        <div class="idnametime">
          <Profile
            class="nameandid"
            :profile="toot.profile"
            @click="openProfile(toot.profile)"
          />
          <Time
            :date="toot.date"
            @click="openConversation"
          />
        </div>
        <template v-if="showToot === true">
          <TlText
            class="text"
            :content="toot.content"
            :mentions="toot.mentions"
          />
          <Images
            v-if="toot.medium.length > 0"
            :medium="toot.medium"
          />
          <Action
            :id="toot.originalId"
            :is-toot-by-own="toot.isTootByOwn"
            :userid="toot.profile.userid"
            :favorited="toot.favorited"
            :boosted="toot.boosted"
            :visibility="toot.visibility"
            :favorites-count="toot.favoritesCount"
            :boosts-count="toot.boostsCount"
            :replies-count="toot.repliesCount"
            :mentions="toot.mentions"
          />
        </template>
        <template v-else>
          <Warning :reason="toot.warningComment" @click.native="showToot = true" />
        </template>
      </div>
    </div>
  </div>
  <div v-else>
    <FollowedBy
      v-if="toot.followedBy"
      :followed-by="toot.followedBy"
      class="notification"
    />
    <div class="toot follow">
      <ProfileImage
        :profile="toot.followedBy"
        @click="openProfile(toot.followedBy)"
      />
      <div class="body">
        <div class="idnametime">
          <Profile
            :profile="toot.followedBy"
            @click="openProfile(toot.followedBy)"
          />
          <Time :date="toot.date" />
        </div>
        <TlText
          class="text"
          :content="toot.followedBy.note"
        />
      </div>
    </div>
  </div>
</template>

<script>
import BoostedBy from '@/components/TimeLine/Toot/BoostedBy'
import FavoritedBy from '@/components/TimeLine/Toot/FavoritedBy'
import FollowedBy from '@/components/TimeLine/Toot/FollowedBy'
import ProfileImage from '@/components/TimeLine/Toot/ProfileImage'
import Profile from '@/components/TimeLine/Toot/Profile'
import Time from '@/components/TimeLine/Toot/Time'
import TlText from '@/components/TimeLine/Toot/TlText'
import Warning from '@/components/TimeLine/Toot/Warning'
import Action from '@/components/TimeLine/Toot/Action'
import Images from '@/components/TimeLine/Toot/Images'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('timelines')

export default {
  components: { BoostedBy, FavoritedBy, FollowedBy, ProfileImage, Profile, Time, TlText, Action, Images, Warning },
  props: ['toot'],
  data () {
    return {
      showToot: true
    }
  },
  methods: {
    ...mapActions(['conversation', 'profile']),
    openConversation () {
      const id = this.toot.originalId
      this.conversation({ id })
    },
    openProfile (profile) {
      const internalid = profile.internalid
      this.profile({ internalid })
    }
  },
  created () {
    this.showToot = this.toot.warning === false
  }
}
</script>

<style scoped>
.nameandid {
  width: calc(100% - 16px);
}
.toot {
  display: flex;
  border-bottom: thin solid #cccccc;
}
.follow {
  padding-bottom: 4px;
}
.body {
  width: calc(100% - 44px);
}
.idnametime {
  display: flex;
  justify-content: space-between;
  padding-right: 4px;
}
.notification {
  margin-left: 28px;
  font-size: 10px;
}
.text {
  overflow-wrap: break-word;
  width: 100%;
}
</style>
