<script setup lang="ts">
import logo from '../../assets/logo.png'
import {useMyInfoStore} from "../../store/myInfoStore.ts";
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {logout} from "../../lib/request.ts";

const i = useMyInfoStore()
const login = ref(false)
const id = ref('')
const name = ref('')
const join = ref(new Date())
const router = useRouter();

onMounted(async () => {
  const d = await i.getMyInfo()
  if(d?.id){
    id.value = d.id
    name.value = d.username
    join.value = new Date(d.created_at)
    login.value = true
  }
})

function formatLocalDateTime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // getMonth() 返回 0-11
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

</script>

<template>
  <div>
    <var-app-bar
        color="transparent"
        text-color="var(--color-text)"
        :elevation="false"
    >
      <h2>Hi，{{ $t('user.welcome')}}</h2>
    </var-app-bar>
    <var-cell style="font-size: 16px">
      <template #icon>
        <var-avatar :src="logo" size="80" color="transparent" style="margin-right: 10px"></var-avatar>
      </template>
      <template #default>
        <var-space v-if="login" direction="column">
          <div><span style="font-size: 18px;font-weight: bold">{{ name }}</span><span>(ID:{{ id }})</span></div>
          <div style="font-size: 14px"><span>{{ $t('user.join') }}：</span><span>{{ formatLocalDateTime(join) }}</span></div>
        </var-space>
        <h2 v-else style="font-size: 20px">
          {{ $t('user.no_login') }}
        </h2>
      </template>
    </var-cell>
    <var-space style="font-size: 18px;--cell-font-size: 16px; --cell-min-height: 50px; --icon-size: 22px; --cell-padding: 10px 15px;" direction="column">
      <var-cell icon="account-circle" :title="$t('user.account')" v-if="login" ripple/>
      <var-divider />
      <var-cell icon="history" :title="$t('user.history')" ripple @click="router.push({name: 'history'})"/>
      <var-cell icon="cog" :title="$t('user.setting')" ripple @click="router.push('/preference')"/>
      <var-cell icon="information" :title="$t('user.about')"  ripple @click="router.push('/about')" />
      <var-divider></var-divider>
      <var-cell block icon="information" v-if="!login" :title="$t('user.login')" @click="router.push({name: 'login'})">
        <template #icon>
          <var-icon name="login" namespace="i" class="var-cell__icon" ></var-icon>
        </template>
      </var-cell>
      <var-cell v-else :title="$t('user.logout')" @click="logout()">
        <template #icon>
          <var-icon name="logout" namespace="i" class="var-cell__icon" ></var-icon>
        </template>
      </var-cell>
    </var-space>
  </div>

</template>

<style scoped>

</style>