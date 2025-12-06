<script setup lang="ts">

import {onMounted, ref} from "vue";
import {useMyInfoStore} from "../../store/myInfoStore.ts";
import {useRoute, useRouter} from "vue-router";

const active = ref(0)

const tabs = {
  'home': 0,
  'popular': 1,
  'discovery': 2,
  'favorite': 3,
  'favorite-artists': 3,
  'favorite-posts': 3,
  'user': 4,
}

const i = useMyInfoStore()

const router = useRouter();
const route = useRoute();

onMounted(async () => {
  await i.getMyInfo()
  active.value = (tabs as any)[route.name as string|| "home"]
})


const change = (name: string) => {
  router.replace({ name: name })
}
</script>

<template>
  <div class="counter">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component"></component>
      </keep-alive>
    </router-view>
  </div>
    <var-bottom-navigation variant v-model:active="active" :fixed="true" :placeholder="true">
      <var-bottom-navigation-item icon="home" @click="change('home')" />
      <var-bottom-navigation-item  @click="change('popular')" >
        <template #icon>
          <var-icon name="creation" namespace="i" class="var-bottom-navigation-item__icon"></var-icon>
        </template>
      </var-bottom-navigation-item>
      <var-bottom-navigation-item icon="magnify" @click="change('discovery')" />
      <var-bottom-navigation-item icon="heart" @click="change('favorite')" />
      <var-bottom-navigation-item icon="account-circle" @click="change('user')"/>
    </var-bottom-navigation>
</template>

<style scoped>
.counter{
  padding: 8px;
}
</style>