<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import lazy_img from '../assets/lazy.webp';
import {colors} from "../lib/interface/service.ts";

const props = defineProps({
  id: String,
  name: String,
  service: String,
  indexed: String,
  updated: String,
  favorited: Number,
})

const router = useRouter();
const color = ref("primary")
onMounted(() => {
  color.value = (colors as any)[props.service as string || 'fanbox'];
})
</script>
<template>
  <var-card @click="router.push({name: 'artist', params: {service: props.service, user: props.id}})">
    <template #image>
      <var-image
          :src="'https://img.kemono.cr/banners/'+ props.service + '/' + props.id"
          fit="contain"
          lazy
          :loading="lazy_img"
          :error="lazy_img"
          referrerpolicy="no-referrer"
      ></var-image>
    </template>
    <template #description>
      <var-space direction="row" style="padding-left: 10px;padding-right: 10px;padding-top: 15px" justify="space-between" align="center">
        <var-space direction="row">
          <var-avatar
              :size="60"
              :src="'https://img.kemono.cr/icons/'+ props.service + '/' + props.id">
          </var-avatar>
          <var-space direction="column" justify="center" style="height: 60px">
            <div style="font-size: 20px">{{ props.name }}</div>
            <div><var-icon name="heart" color="var(--color-primary)"/>{{ props.favorited }}</div>
          </var-space>
        </var-space>
        <var-chip :color="color">
          {{ props.service }}
        </var-chip>
      </var-space>
    </template>
  </var-card>
</template>
<style scoped>

</style>