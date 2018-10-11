<template>
  <NewToot class="newtoot" :userId="userId"></NewToot>
</template>

<script>
import NewToot from '../components/NewToot/NewToot'
export default {
  components: { NewToot },
  props: { userId: Number }
}
</script>

<style scoped>
</style>
