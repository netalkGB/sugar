<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  components: {}
}
</script>

<style>
html {
  font-family: '游ゴシック Medium', 'Yu Gothic Medium', '游ゴシック体', YuGothic,
    メイリオ, 'Noto Sans CJK JP', 'TakaoEXゴシック', 'TakaoExGothic', sans-serif;
}
html,
body {
  margin: 0;
  padding: 0;
  color: #3e3e3e;
  user-select: none;
}
*::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
*::webkit-scrollbar-track {
  background: #efefef;
}
*::-webkit-scrollbar-thumb {
  background: #cccccc;
}
*::-webkit-scrollbar-thumb:hover {
  background: #aaaaaa;
}
a {
  text-decoration: none;
  color: #5555cc;
}
p {
  margin: 0;
  padding: 0;
}
</style>
