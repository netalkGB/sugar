<template>
  <div id="images">
    <img src="https://avatars3.githubusercontent.com/u/13611993">
    <img src="https://avatars3.githubusercontent.com/u/13611993">
    <img src="https://avatars3.githubusercontent.com/u/13611993">
    <img src="https://avatars3.githubusercontent.com/u/13611993">
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
#images {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
}
#images > img {
  max-width: calc(50% - 8px);
  padding-bottom: 4px;
  max-height: 80px;
}
</style>
