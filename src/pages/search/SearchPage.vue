<script setup lang="ts">

// 初始化 Store
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();

const s = ref('')
const m = ref('artist')
const keyword = ref('')
const services = ref([
  {label: "Fanbox", value: "fanbox"},
  {label: "Patreon", value: "patreon"},
  {label: "DLsite", value: "dlsite"},
  {label: "Discord", value: "discord"},
  {label: "Fantia", value: "fantia"},
  {label: "Gumroad", value: "gumroad"},
  {label: "Afdian", value: "afdian"},
  {label: "Boosty", value: "boosty"},
  {label: "SubscribeStar", value: "subscribestar"},
]);

// 组件挂载时加载数据
onMounted(() => {


});

// 执行搜索的方法

</script>
<template>
  <var-space direction="column">
    <var-input
        variant="outlined"
        :placeholder="$t('search.placeholder')"
        v-model="keyword"
        :hint="false"
        :autofocus="true"
    >
      <template #prepend-icon>
        <var-icon name="chevron-left" @click="router.back()" style="margin-right: 5px" />
      </template>
      <template #append-icon>
        <var-icon class="append-icon" name="magnify" @click="router.push({name: 'search-result', query: {method: m, keyword: keyword, service: s}})" />
      </template>
    </var-input>
    <var-space direction="column">
      <var-space direction="column">
        <div>{{ $t('search.method') }}</div>
        <var-radio-group v-model="m">
          <var-space direction="row">
            <var-chip type="primary" size="large" :plain="m !== 'artist'">
              <var-radio
                  :checked-value="'artist'"
                  style="margin-right: -12px; margin-left: -12px;font-size: 14px"
              >
                <template #unchecked-icon>
                  <div style="height: 24px"></div>
                </template>
                <template #checked-icon>
                  <var-icon name="check" size="24px"/>
                </template>
                {{ $t('search.artist')}}
              </var-radio>
            </var-chip>
            <var-chip type="primary" size="large" :plain="m !== 'post'">
              <var-radio
                  :checked-value="'post'"
                  style="font-size: 14px"
              >
                <template #unchecked-icon>
                  <div style="height: 24px"></div>
                </template>
                <template #checked-icon>
                  <var-icon name="check" size="24px"/>
                </template>
                {{ $t('search.post')}}
              </var-radio>
            </var-chip>
          </var-space>
        </var-radio-group>
      </var-space>
      <var-space direction="column" v-show="m === 'artist'">
        <div>{{ $t('search.services') }}</div>
        <var-radio-group v-model="s">
          <var-space justify="start" wrap>
            <var-chip :plain="s !== service.value" size="large" type="primary" v-for="service in services" v-ripple>
              <var-radio
                  :checked-value="service.value"
                  style="font-size: 14px; margin-left: -5px;margin-right: -5px"
              >
                <template #unchecked-icon>
                  <div style="height: 24px"></div>
                </template>
                <template #checked-icon>
                  <var-icon name="check" size="24px"/>
                </template>
                {{ service.label }}
              </var-radio>
            </var-chip>
          </var-space>
          <var-radio checked-value="" style="display: none"></var-radio>
        </var-radio-group>
      </var-space>
      </var-space>
  </var-space>

</template>

<style scoped>

</style>