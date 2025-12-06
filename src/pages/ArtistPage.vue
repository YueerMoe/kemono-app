<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {colors, Service} from "../lib/interface/service.ts";

import {useRoute, useRouter} from "vue-router";
import { shareText } from "@buildyourwebapp/tauri-plugin-sharesheet";
import {getProfile, Profile} from "../lib/request.ts";

import FavoriteButton from "../components/FavoriteButton.vue";

const active = ref(0)


const loading = ref(true)
const router = useRouter();
const route = useRoute();

const service = ref<Service>()
const user = ref('')
const profile = ref<Profile>()



const color = ref("primary")

onMounted(async () => {
  await router.replace({name: 'artist-posts'})
  service.value = <Service>route.params.service
  user.value = <string>route.params.user
  color.value = colors[service.value];
  loading.value = true;
  try {
    profile.value = await getProfile(service.value, user.value);
    // 使用 profile...
  } catch (e) {
    await router.push({ name: 'error', query: { message: (e as Error).message } });
  }

  loading.value = false;
})

const back = async () => {
  console.log()
  router.go(-1)
}
</script>

<template>
  <var-loading v-if="loading" style="margin-top: 20vh">
  </var-loading>
  <div v-else>
  <var-app-bar
      color="transparent"
      text-color="black"
      fixed
      :placeholder="true"
      elevation="0"
      z-index="999"
      :safe-area-top="true"
  >
    <template #left>
      <var-button round text>
        <var-icon name="arrow-left" namespace="i" :size="30" @click="back()"/>
      </var-button>
    </template>
    <template #right>
      <var-button
          round
          text
          style="margin-right: 8px"
          @click="shareText('https://kemono.cr/'+service+'/user/'+user)"
      >
        <var-icon namespace="i" name="share-variant" :size="24" />
      </var-button>
      <var-button round text>
        <var-icon name="dots-vertical" :size="24" />
      </var-button>
    </template>
  </var-app-bar>
  <var-card
      style="margin-top: -108px;
      --card-background: var(--color-profile-background);"
      :elevation="false"
  >
    <template #image>
      <var-image
          :src="'https://img.kemono.cr/banners/'+service+'/'+user"
          fit="cover"
          height="13vh"
      >
      </var-image>
    </template>
    <template #title>
      <var-space
          justify="space-between"
          direction="row"
          align="center"
          style="margin-top: -30px;margin-left: 15px; margin-right:15px;--space-size-normal-y:0"
      >
        <var-space
            direction="column"
        >
          <var-avatar
              color="#fff"
              size="80"
              :src="'https://img.kemono.cr/icons/'+service+'/'+user"
          >
          </var-avatar>
          <var-space direction="row" align="center">
            <div style="font-size: 20px; margin-right: 10px">
              {{ profile?.name}}
            </div>
            <var-chip :color="color" size="small">
              {{ service }}
            </var-chip>
          </var-space>
        </var-space>
        <favorite-button
            :id="profile?.id"
            :service="profile?.service"
        ></favorite-button>
      </var-space>
    </template>
    <template #description>

    </template>
  </var-card>
  <var-sticky offset-top="0" z-index="777">
    <div style="height: 108px; background: var(--color-profile-background);margin-bottom: -50px"></div>
  </var-sticky>
      <var-tabs
          sticky
          :elevation="false"
          v-model:active="active"
          :sticky-z-index="888"
          color="var(--color-profile-background)"
          class="cat-tab"
          offset-top="108"
      >
        <var-tab @click="router.replace({name: 'artist-posts'})">{{ $t('artist.posts') }}</var-tab>
        <var-tab @click="router.replace({name: 'artist-announcements'})">{{ $t('artist.announcements') }}</var-tab>
      </var-tabs>
  <div style="margin: 8px" >
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