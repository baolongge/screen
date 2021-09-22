
<template>
  <div class="app">
    <router-view/>
  </div>
</template>

<script setup>

import HelloWorld from "./components/HelloWorld.vue";
import home from "./views/home/index.vue";
</script>


<style>
.app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
