<template>
  <div id="sidebar">
    <div id="menu">
      <div>
                   <b-icon
                pack="fas"
                icon="user">
            </b-icon>
        <router-link :to="{name:'home_timeline'}">
g
        </router-link>
      </div>
      <div>
        <router-link :to="{name:'local_timeline'}">ltl</router-link>
      </div>
    </div>
    <div id="menu2">
      a
      <br>
      b
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style>
#sidebar {
  background-color: #e8e8e8;
  height: 100%;
  border-right: thin solid #aaaaaa;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
