<template>
  <div v-if="!toot.followedBy">
    <BoostedBy
      v-if="toot.boostedBy"
      :boostedBy="toot.boostedBy"
      @click="openProfile(toot.boostedBy)"
      class="notification"
    />
    <FavoritedBy
      v-if="toot.favoritedBy"
      :favoritedBy="toot.favoritedBy"
      @click="openProfile(toot.favoritedBy)"
      class="notification"
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
            @click="openConversation"
            :date="toot.date"
          />
        </div>
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
          :isTootByOwn="toot.isTootByOwn"
          :userid="toot.profile.userid"
          :id="toot.originalId"
          :favorited="toot.favorited"
          :boosted="toot.boosted"
          :visibility="toot.visibility"
          :favoritesCount="toot.favoritesCount"
          :boostsCount="toot.boostsCount"
          :repliesCount="toot.repliesCount"
        />
      </div>
    </div>
  </div>
  <div v-else>
    <FollowedBy
      v-if="toot.followedBy"
      :followedBy="toot.followedBy"
      class="notification"
    />
    <div class="toot follow">
      <ProfileImage
        @click="openProfile(toot.followedBy)"
        :profile="toot.followedBy"
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
import Action from '@/components/TimeLine/Toot/Action'
import Images from '@/components/TimeLine/Toot/Images'
import { mapActions } from 'vuex'

export default {
  components: { BoostedBy, FavoritedBy, FollowedBy, ProfileImage, Profile, Time, TlText, Action, Images },
  props: ['toot'],
  methods: {
    ...mapActions('timelines', ['conversation', 'profile']),
    openConversation () {
      const id = this.toot.originalId
      this.conversation({ id })
    },
    openProfile (profile) {
      const internalid = profile.internalid
      this.profile({ internalid })
    }
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
