<script setup lang="ts">
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {locale, t} from "../../i18n";
import {useConfigStore} from "../../store/configStore.ts";

const router = useRouter();

const lang = ref("en_US")

const theme = ref('light')

const languages: string[] = [
    'System',
    'en-US',
    'zh-CN',
]

const themes: string[] = [
    'light',
    'dark',
    'system'
]

//const system  = await os_locale();

const system = "zh-CN"

const config = useConfigStore()

const change_lang = async () =>{

  if(lang.value == "System"){

    locale.value = system

  }else {

    locale.value = lang.value;

  }
  await config.setLanguage(lang.value);
}

onMounted(async () => {

  await config.loadConfig()

  lang.value = await config.getLanguage()

})
</script>

<template>
  <var-app-bar
      color="transparent"
      text-color="var(--color-text)"
      :elevation="false"
  >
    <template #left>
      <var-icon name="chevron-left" @click="router.back()" style="margin-right: 5px" />
    </template>
    <h2>{{ t('preferences.title') }}</h2>
  </var-app-bar>
  <var-space direction="column" style=" --cell-padding: 10px 20px; --cell-min-height: 60px;">
    <var-cell :title="t('preferences.language')">
      <template #icon>
        <var-icon name="translate" namespace="i" class="var-cell__icon" />
      </template>
      <template #extra>
        <var-chip type="primary">
          <var-select
              :chip="true"
              v-model="lang"
              @change="change_lang"
              style="width: 80px; --field-decorator-line-size: 0; --field-decorator-line-focus-size: 0;--field-decorator-standard-normal-margin-top: 0">
            <var-option :label="l" :value="l" v-for="l in languages" />
          </var-select>
        </var-chip>
      </template>
    </var-cell>
    <var-cell :title="t('preferences.theme')" v-if="false">
      <template #icon>
        <var-icon name="palette" class="var-cell__icon" />
      </template>
      <template #extra>
        <var-chip type="primary">
          <var-select
              :chip="true"
              v-model="theme"
              @change="change_lang"
              style="width: 80px; --field-decorator-line-size: 0; --field-decorator-line-focus-size: 0;--field-decorator-standard-normal-margin-top: 0">
            <var-option :label="l" :value="l" v-for="l in themes" />
          </var-select>
        </var-chip>
      </template>
    </var-cell>
  </var-space>
</template>

<style scoped>

</style>