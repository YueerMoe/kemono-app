<script setup lang="ts">
import {useRouter} from "vue-router";
import { openUrl} from "@tauri-apps/plugin-opener";
import logo from '../assets/logo.png'
import {onMounted, ref} from "vue";
import {getVersion} from "@tauri-apps/api/app";
const router = useRouter();

const v = ref('0.1.0')

onMounted(async () => {
  v.value = await getVersion();
})
</script>

<template>
    <var-app-bar
        color="transparent"
        text-color="var(--color-text)"
        :elevation="false"
    >
      <template #left>
        <var-icon name="arrow-left" namespace="i" :size="30" @click="router.back()" style="margin-right: 5px"/>
      </template>
      <h2>{{ $t('about.title') }}</h2>
    </var-app-bar>
    <var-space direction="column" style="padding-left: 10px; padding-right: 10px; --cell-min-height: 80px">
      <var-space direction="column" justify="center" align="center">
        <var-image :src="logo" width="100" style="margin: 15px"></var-image>
        <div style="font-weight: bold">Version:{{ v }}</div>
        <div>{{ $t('about.tips.title')}}</div>
        <div style="width: 80vw;text-align: center">{{ $t('about.tips.description')}}</div>
      </var-space>
      <var-cell ripple @click="openUrl('https://github.com/YueerMoe/kemono-app')">
        <template #default>
          <div class="cell-box">
            <var-icon name="github" size="32" class="icon"/>
            <div>
              <div class="title">
                {{ $t('about.project.title') }}
              </div>
              <div class="description">
                https://github.com/YueerMoe/kemono-app
              </div>
            </div>
          </div>
        </template>
      </var-cell>
      <var-cell ripple @click="openUrl('github.com/114514/1919810')">
        <template #default>
          <div class="cell-box">
            <var-icon name="translate" namespace="i" size="32" class="icon"/>
            <div>
              <div class="title">
                {{ $t('about.translate.title') }}
              </div>
              <div class="description">
                {{ $t('about.translate.description') }}
              </div>
            </div>
          </div>
        </template>
      </var-cell>
    </var-space>
</template>

<style scoped>
.cell-box{
  display: flex;
  flex-direction: row;
}
.cell-box .icon{
  margin: 10px;
}
.cell-box .title{
  font-size: 16px;
}
.cell-box .description{
  font-size: 14px;
}
</style>