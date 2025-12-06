<script setup lang="ts">

import PostCard from "../../components/PostCard.vue";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {Post} from "../../lib/interface/post.ts";
import {getPosts, getProfile} from "../../lib/request.ts";

const left = ref<Post[]>([])
const right = ref<Post[]>([])

const max = ref(0)

const page = ref(1)

const router = useRouter();
const route = useRoute();

const loading = ref(true);

const finish = ref(false);

async function splitArrayByParity<T>(arr: T[]): Promise<[T[], T[]]> {
  // [even_indexed_array, odd_indexed_array]
  return arr.reduce((acc, current, index) => {
    if (index % 2 === 0) {
      // 偶数索引 (0, 2, 4, ...)
      acc[0].push(current);
    } else {
      // 奇数索引 (1, 3, 5, ...)
      acc[1].push(current);
    }
    return acc;
  }, [[], []] as [T[], T[]]); // 初始值是一个包含两个空数组的元组
}

async function getPostList() {
  try {
    const res = await getPosts(<string>route.params.service, <string>route.params.user, page.value)

    const [l, r] = await splitArrayByParity(res)

    left.value.push(...l)
    right.value.push(...r)

    page.value += 1;

    loading.value = false;

  } catch (e) {
    await router.push({name: 'error', query: {message: (e as Error).message}});
  }
}

async function load(){
  if(max.value == 0){
    return;
  }
  if(max.value == page.value && max.value > 0){
    finish.value = true;
  }else{
    await getPostList();
  }
}

onMounted(async () => {
  loading.value = true;

  const artist = await getProfile(<string>route.params.service, <string>route.params.user);

  max.value = Math.ceil(artist.post_count / 50);

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
    <var-space direction="row" justify="center" style="width: 99%;margin-top: 10px" align="flex-start">
      <var-space direction="column" align="center" style="width: 46vw;">
        <var-cell v-for="post in left" :key="post.id">
          <post-card
              :post="post"
          />
        </var-cell>
      </var-space>
      <var-space direction="column" align="center" style="width: 46vw;">
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