<template>
  <div>
    <nt-button @click="increment">
      TEST
    </nt-button>
    <div>{{ count }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { createNamespacedHelpers } from 'vuex'
import NtButton from '@/components/NtButton.vue'

const { mapActions, mapGetters } = createNamespacedHelpers('counter')

export default Vue.extend({
  components: {
    NtButton
  },
  computed: {
    ...mapGetters({
      count: 'getCount'
    })
  },
  mounted () {
    /* eslint no-console: 0 */
    console.log('mounted')
  },
  methods: {
    increment () {
      /* eslint no-console: 0 */
      console.log('increment')
      this.add()
    },
    ...mapActions({
      add: 'increment' // this.add()でactionのincrement呼び出す
    })
  }
})
</script>
