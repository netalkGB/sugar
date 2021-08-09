<template>
  <div class="favourite">
    <TimeLine
      ref="timeline"
      :infinite-mode="false"
      :timeline="timeline"
    />
  </div>
</template>

<script>
import TimeLine from '@/components/TimeLine/TimeLine'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('favourite')
const { mapState } = createNamespacedHelpers('favourite')

export default {
  components: {
    TimeLine
  },
  computed: {
    ...mapState({ timeline: state => state.timeline })
  },
  mounted () {
    this.fetchFavourite()
  },
  methods: {
    ...mapActions(['fetchFavourite'])
  }
}
</script>

<style scoped>
</style>
