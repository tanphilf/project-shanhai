<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <router-view />
  </div>
</template>

<script>
  require("@/utils/device.js");
</script>

<style lang="scss">
  @import url(./common/app.scss);
</style>
