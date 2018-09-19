<template>
  <div id="tootwrapper">
    <BoostedBy class="notification"/>
    <FavoritedBy class="notification"/>
    <div id="toot">
      <ProfileImage />
      <div id="body">
        <div id="idnametime">
          <Profile />
          <Time />
        </div>
        <TlText/>
        <Images />
        <Action />
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
  components: { BoostedBy, FavoritedBy, ProfileImage, Profile, Time, TlText, Action, Images }
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
