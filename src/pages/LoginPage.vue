<script setup lang="ts">

import {ref} from "vue";
import {login} from "../lib/request.ts";
import {openUrl} from "@tauri-apps/plugin-opener";
import {useRouter} from "vue-router";
import {Snackbar} from "@varlet/ui";

const uname = ref('')
const pwd = ref('')
const router = useRouter();
const log_in = async () => {
  const success = await login(uname.value, pwd.value)
  if(success){
    Snackbar({
      type: 'success',
      content: 'success',
      position: "bottom"
    })
    router.go(-1)
  }
}

const reg = ()=>{
  openUrl("https://kemono.cr/authentication/register")
}
</script>

<template>
  <var-app-bar
      color="transparent"
      text-color="var(--color-text)"
      :elevation="false"
  >
    <template #left>
      <var-icon name="chevron-left" @click="router.go(-1)"/>
    </template>
    <h2 style="margin-left: 5vw">{{ $t('user.login') }}</h2>
  </var-app-bar>
  <var-space direction="column" justify="center" align="center" style="height: 80vh">
    <h2>{{ $t('user.login') }} kemono.cr</h2>
    <var-input variant="outlined" :placeholder="$t('login.username')" v-model="uname" style="width: 80vw">
      <template #prepend-icon>
        <var-icon name="account-circle" class="prepend-icon"/>
      </template>
    </var-input>
    <var-input variant="outlined" :placeholder="$t('login.password')" v-model="pwd" type="password" style="width: 80vw">
      <template #prepend-icon>
        <var-icon name="lock" class="prepend-icon"/>
      </template>
    </var-input>
    <var-button @click="log_in" style="margin-top: 20px" type="primary">{{ $t('user.login') }}</var-button>
  </var-space>
  <var-space direction="row" justify="center" align="center" @click="reg">
    <div>{{ $t('user.register') }}</div>
    <var-icon name="tag-outline" />
  </var-space>
</template>

<style scoped>

</style>