<script setup lang="ts">

import PostCard from "../../components/PostCard.vue";
import {onMounted, ref} from "vue";
import {Post} from "../../lib/interface/post.ts";
import {splitArrayByParity} from "../../lib/cat.ts";
import {searchPosts} from "../../lib/request.ts";

const props = defineProps({
  keyword: String,
  tag: Boolean
})

const page = ref(1);

const left = ref<Post[]>([])

const right = ref<Post[]>([])

const finish = ref<boolean>(false);

const loading = ref(false);

async function search() {

  const res = await searchPosts(page.value, props.keyword || '', props.tag );

  let l, r: Post[];

  if(res){
     [l, r] = await splitArrayByParity(res.posts as Post[])
  }else {
    l = [] as Post[];
    r = [] as Post[];
  }

  left.value.push(...l)
  right.value.push(...r)

  if(Math.ceil((res.count || 0) / 50) == page.value){
    finish.value = true;
  }else{
    page.value += 1;
  }

  loading.value = false;

}

async function load(){
    await search();
}

onMounted(async () => {
  loading.value = true;
  await load()
})

</script>

<template>
  <var-list
      @load="load"
      v-model:loading="loading"
      :finished="finish"
      :offset="0"
      :finished-text="$t('List.finish')"
      :loading-text="$t('List.loading')"
  >
    <var-space direction="row" justify="center" style="width: 100%">
      <var-space direction="column" align="center" style="width: 45vw; margin-top: 10px">
        <var-cell v-for="post in left" :key="post.id">
          <post-card
              :post="post"
          />
        </var-cell>
      </var-space>
      <var-space direction="column" align="center" style="width: 45vw; margin-top: 10px">
        <var-cell v-for="post in right" :key="post.id">
          <post-card
              :post="post"
          />
        </var-cell>
      </var-space>
    </var-space>
  </var-list>
</template>

<style scoped>

</style>