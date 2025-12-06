<script setup lang="ts">
import { StyleProvider } from '@varlet/ui'
import {customTheme} from "./assets/theme.ts";
import {onMounted} from "vue";
import {useConfigStore} from "./store/configStore.ts";
import {locale} from "./i18n";
import {locale as os_local} from "@tauri-apps/plugin-os"

StyleProvider(customTheme.light)

const cfg = useConfigStore()
onMounted(async () => {
  const lang = await cfg.getLanguage()
  if (lang === 'System') {
    const os = await os_local()
    if (os){
      locale.value = os as string
    }else{
      locale.value = 'en-US'
    }
  }else{
    locale.value = lang
  }
})

</script>

<template>
    <router-view ></router-view>
</template>

<style>
body {
  transition: background-color .25s, color .25s;
  color: var(--color-text);
  background-color: var(--color-body);
  margin: 0;
  color-scheme: var(--color-scheme);
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  padding-left: 0;
}
</style>