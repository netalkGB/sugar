<template>
  <div>
    <div class="user">
      <ProfileImage
        :profile="user"
        @click="openProfile(user)"
      />
      <div class="body">
        <div class="idnametime">
          <Profile
            :profile="user"
            @click="openProfile(user)"
          />
        </div>
        <TlText
          class="text"
          :content="user.note"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ProfileImage from '@/components/TimeLine/Toot/ProfileImage'
import Profile from '@/components/TimeLine/Toot/Profile'
import TlText from '@/components/TimeLine/Toot/TlText'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('timelines')

export default {
  components: { ProfileImage, Profile, TlText },
  props: ['user'],
  methods: {
    ...mapActions(['profile']),
    openProfile (profile) {
      const internalid = profile.internalid
      this.profile({ internalid })
    }
  }
}
</script>

<style scoped>
.user {
  display: flex;
  border-bottom: thin solid #cccccc;
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
.text {
  overflow-wrap: break-word;
  width: 100%;
  cursor: pointer;
}
</style>
