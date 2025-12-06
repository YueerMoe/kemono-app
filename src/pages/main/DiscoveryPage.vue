<script setup lang="ts">

import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {fetch} from '@tauri-apps/plugin-http';
import {Record, SearchType, useSearchHistoryStore} from "../../store/historySearchStore.ts";

const tags = ref([{
  tag:  "加载中",
  post_count: 114514
}])
const router = useRouter();

const loading = ref(false);

const history = useSearchHistoryStore()

const records = ref<Record[]>([] as Record[])

const del = async () =>{
  await history.deleteSearchRecord();
  records.value = [] as Record[]
}

const jump = (type: SearchType, key: string) => {
  router.push({name: 'search-result', query: {method: type, keyword: key}});
}

const fetchTags = async () => {
  loading.value = true;
  try {
    const response = await fetch(
        'https://kemono.cr/api/v1/posts/tags',
        {
          method: 'GET',
          headers: {
            'origin': 'https://kemono.cr'
          }
        });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: [] = await response.json();

    tags.value = data.slice(0, 50);

  } catch (err: any) {
    console.log('Fetch error:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchTags();
  records.value = await history.getSearchHistory()
})
</script>

<template>
  <var-space direction="column">
    <var-input variant="outlined" :placeholder="$t('search.placeholder')" :hint="false" @click="router.push('search')">
      <template #prepend-icon>
        <var-icon class="prepend-icon" name="magnify" />
      </template>
    </var-input>
    <var-space direction="column">
      <h2>
        {{ $t('search.title') }}
      </h2>
      <var-space direction="column">
        <var-space direction="column">
          <div style="margin: 5px;font-size: 16px">{{ $t('search.history.title') }}</div>
          <var-space>
            <var-chip type="primary" size="large" v-for="record in records" :key="record" @click="jump(record.type, record.keyword)">
              {{ `${record.type}:${record.keyword}` }}
            </var-chip>
          </var-space>
          <var-cell ripple @click="del()" v-show="records.length > 0">
            <var-space direction="row" justify="center" align="center">
              <var-icon name="delete" size="26"></var-icon>
              <div>{{ $t('search.history.clean') }}</div>
            </var-space>
          </var-cell>
        </var-space>
        <var-space direction="column">
          <div style="margin: 5px;font-size: 16px">{{ $t('search.popular') }}</div>
          <var-loading v-if="loading"></var-loading>
          <var-space v-else direction="row" wrap>
            <var-button text v-for="tag in tags" @click="jump(SearchType.Tag, tag.tag)">
              <var-chip type="primary" size="large" style="margin-right: -12px; margin-left: -12px;font-size: 14px">
                {{ tag.tag }}
              </var-chip>
            </var-button>
          </var-space>
        </var-space>
      </var-space>
    </var-space>
    <p />
  </var-space>
</template>

<style scoped>

</style>