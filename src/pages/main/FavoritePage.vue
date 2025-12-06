<script setup lang="ts">

import {onMounted, ref} from "vue";
import {useMyInfoStore} from "../../store/myInfoStore.ts";
import {useRouter} from "vue-router";

const my = useMyInfoStore()

const login = ref(false)
const router = useRouter();

onMounted(async () => {
  const me = await my.getMyInfo();
  login.value = !!me?.id;
})

const active = ref(0)
</script>

<template>
  <div>
    <var-result
        type="error"
        style="margin-top: 20vh"
        v-if="!login"
    >
      <template #description>
        <div style="margin-top: 20px; width: 70vw">
          {{ $t('user.no_login') }}
        </div>
      </template>
      <template #footer>
        <var-button type="primary" @click="router.push({name: 'login'})">{{ $t('user.login') }}</var-button>
      </template>
    </var-result>
    <div v-else>
      <var-tabs v-model:active="active" style="margin-bottom: 5px; width: 60%; margin-left: 20%">
        <var-tab @click="router.replace({name: 'favorite-artists'})">{{ $t('favorite.artist.title') }}</var-tab>
        <var-tab @click="router.replace({name: 'favorite-posts'})">{{ $t('favorite.post.title') }}</var-tab>
      </var-tabs>
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </div>
  </div>

</template>

<style scoped>

</style>