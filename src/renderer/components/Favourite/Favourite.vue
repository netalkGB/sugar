<template>
  <div class="favourite">
    <TimeLine
      :infiniteMode="false"
      :timeline="timeline"
      ref="timeline"
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
  methods: {
    ...mapActions(['fetchFavourite'])
  },
  computed: {
    ...mapState({ timeline: state => state.timeline })
  },
  mounted () {
    this.fetchFavourite()
  }
}
</script>

<style scoped>
</style>
