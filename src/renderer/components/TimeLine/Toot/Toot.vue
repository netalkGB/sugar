<template>
  <div id="tootwrapper">
    <BoostedBy v-if="toot.boostedBy" :boostedBy="toot.boostedBy" class="notification"/>
    <FavoritedBy style="display:none;" class="notification"/>
    <div id="toot">
      <ProfileImage :profile="toot.profile" />
      <div id="body">
        <div id="idnametime">
          <Profile :profile="toot.profile"/>
          <Time :date="toot.date"/>
        </div>
        <TlText :content="toot.content"/>
        <Images :medium="toot.medium"/>
        <Action :visibility="toot.visibility" :favoritesCount="toot.favoritesCount" :boostsCount="toot.boostsCount" :repliesCount="toot.repliesCount"/>
      </div>
    </div>
  </div>
</template>

<script>
import BoostedBy from './BoostedBy'
import FavoritedBy from './FavoritedBy'
import ProfileImage from './ProfileImage'
import Profile from './Profile'
import Time from './Time'
import TlText from './TlText'
import Action from './Action'
import Images from './Images'

export default {
  components: { BoostedBy, FavoritedBy, ProfileImage, Profile, Time, TlText, Action, Images },
  props: ['toot']
}
</script>

<style scoped>
#toot {
  display: flex;
  border-bottom: thin solid #cccccc;
  padding: 2px 4px 0px 4px;
}
#body {
  width: calc(100% - 44px);
}
#idnametime {
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
