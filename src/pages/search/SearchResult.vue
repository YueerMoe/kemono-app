<script setup lang="ts">

import {onMounted, ref} from "vue";
import ArtistCard from "../../components/ArtistCard.vue";
import {useArtistStore} from "../../store/artistStore.ts";
import {Artist} from "../../lib/interface/artist.ts";
import {useRoute, useRouter} from "vue-router";
import {Dialog} from "@varlet/ui";
import PostResults from "./PostResults.vue";
import {SearchType, useSearchHistoryStore} from "../../store/historySearchStore.ts";

const route = useRoute();

const router = useRouter();

const artists = ref<Artist[]>([])

const store = useArtistStore();

const history = useSearchHistoryStore();

const loading = ref(true);

const keyword = ref("");

const service = ref("");

onMounted(async () => {
  if(route.query.keyword) {
    keyword.value = route.query.keyword as string;
    if(route.query.service) {
      service.value = route.query.service as string;
    }
  }else {
    Dialog({
      message: '参数为空'
    }).then(()=>{
      loading.value = false;
      router.go(-1)
    })
  }
  if (route.query.method === "artist") {
    if (keyword.value) {
      artists.value = await store.searchByNameAndService(
          keyword.value,
          service.value // 如果为空字符串，则传递 undefined 给 Store
      );
      history.addSearchRecord(SearchType.Artist, keyword.value);
      loading.value = false;
    }else{

    }
  }else {
    if (route.query.method === 'tag') {
      history.addSearchRecord(SearchType.Tag, route.query.tag as string);
    }else{
      history.addSearchRecord(SearchType.Post, keyword.value);
    }
    loading.value = false;
  }
})

</script>

<template>
  <div v-if="loading" style="margin-top: 30vh">
    <var-loading />
  </div>
  <div v-else>
    <var-space direction="row" justify="flex-start" align="center" style="height: 80px">
      <var-button @click="router.back()" round text>
        <var-icon name="arrow-left" namespace="i" :size="32" />
      </var-button>
      <div style="font-size: 20px">{{ $t('search.result.title') }}</div>
    </var-space>
    <var-space direction="column" v-if="route.query.method == 'artist'">
        <artist-card v-for="artist in artists" :name="artist.name" :favorited="artist.favorited" :service="artist.service" :id="artist.id"/>
    </var-space>
   <post-results v-else :keyword="keyword" :tag="route.query.method === 'tag'"></post-results>
  </div>
</template>

<style scoped>

</style>