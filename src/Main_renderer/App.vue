<template>
  <!-- <router-view /> -->
   <HomeView/>
  <ConfigPanel v-model="showConfig"/>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ConfigPanel from "./components/ConfigPanel.vue";
import HomeView from './views/HomeView.vue';

import { useConfigStore } from "./store/store";
const showConfig = ref(false);





onMounted(() => {
  useConfigStore().loadConfig();
  window.electronAPI.onOpenConfigPage(() => {
    showConfig.value = true;
  })
})

</script>

<style lang="css" scoped>
main {
  display: flex;
  flex-direction: row;
  min-height: calc(100vh - 60px);
  /* 60px为footer高度，可调整 */
  align-items: stretch;
}

aside {
  width: 180px;
  /* 两侧宽度可自定义 */
  background: #f5f5f7;
}

main>div {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

footer {
  height: 60px;
  background: #e0e0e0;
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
}
</style>