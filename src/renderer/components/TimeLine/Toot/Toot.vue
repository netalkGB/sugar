<template>
  <div v-if="!toot.followedBy">
    <BoostedBy v-if="toot.boostedBy" :boostedBy="toot.boostedBy" class="notification" />
    <FavoritedBy v-if="toot.favoritedBy" :favoritedBy="toot.favoritedBy" class="notification" />
    <div class="toot">
      <ProfileImage :profile="toot.profile" />
      <div class="body">
        <div class="idnametime">
          <Profile :profile="toot.profile" />
          <Time :date="toot.date" />
        </div>
        <TlText :content="toot.content" />
        <Images v-if="toot.medium.length > 0" :medium="toot.medium" />
        <Action :userid="toot.profile.userid" :id="toot.originalId" :favorited="toot.favorited" :boosted="toot.boosted" :visibility="toot.visibility" :favoritesCount="toot.favoritesCount" :boostsCount="toot.boostsCount" :repliesCount="toot.repliesCount" />
      </div>
    </div>
  </div>
  <div  v-else>
    <FollowedBy v-if="toot.followedBy" :followedBy="toot.followedBy" class="notification" />
    <div class="toot follow">
      <ProfileImage :profile="toot.followedBy" />
      <div class="body">
        <div class="idnametime">
          <Profile :profile="toot.followedBy" />
          <Time :date="toot.date" />
        </div>
        <div v-html="toot.followedBy.note"></div>
      </div>
    </div>
  </div>
</template>

<script>
import BoostedBy from './BoostedBy'
import FavoritedBy from './FavoritedBy'
import FollowedBy from './FollowedBy'
import ProfileImage from './ProfileImage'
import Profile from './Profile'
import Time from './Time'
import TlText from './TlText'
import Action from './Action'
import Images from './Images'

export default {
  components: { BoostedBy, FavoritedBy, FollowedBy, ProfileImage, Profile, Time, TlText, Action, Images },
  props: ['toot']
}
</script>

<style scoped>
.toot {
  display: flex;
  border-bottom: thin solid #cccccc;
  padding: 2px 4px 0px 4px;
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
  padding-left: 4px;
  padding-right: 4px;
}
.notification {
  margin-left: 40px;
  font-size: 85%;
}
</style>
