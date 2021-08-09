<template>
  <span>{{ name }}</span>
</template>

<script>
export default {
  props: {
    profile: {
      type: Object,
      required: true
    }
  },
  computed: {
    name () {
      const { userid, displayName } = this.profile
      if (displayName.length > 0) {
        return displayName
      } else {
        const splited = userid.split('@')
        return splited[0]
      }
    }
  }
}
</script>

<style>
</style>
