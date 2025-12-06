<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useFavoritedPostStore} from "../../store/favotitedPostStore.ts";

import {PostContent} from "../../lib/interface/PostContent.ts";
import PostCard from "../../components/PostCard.vue";
import {Post} from "../../lib/interface/post.ts";

const f = useFavoritedPostStore()

const loading = ref<boolean>(true)



const left = ref<PostContent[]>([])
const right = ref<PostContent[]>([])

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


const get_f_list = async () => {

  loading.value = true

  const res = await f.fetchFavoritedPostList();

  const [l, r] = await splitArrayByParity(res)

  left.value.push(...l)
  right.value.push(...r)

  loading.value = false

}

const contentToPost = (p: PostContent): Post =>{
  return {
    id: p.id,
    title: p.title,
    user: p.user,
    published: p.published,
    service: p.service,
    'substring': '',
    file: p.file,
    attachments: p.attachments,
  } as Post
}
onMounted(async () => {
  await get_f_list()
})
</script>

<template>
  <var-loading v-if="loading" />
    <var-space direction="row" justify="center" style="width: 100%;">
      <var-space direction="column" align="center" justify="flex-start" style="width: 45vw; margin-top: 10px">
        <var-cell v-for="post in left" :key="post.id">
          <post-card
              :post="contentToPost(post)"
          />
        </var-cell>
      </var-space>
      <var-space direction="column" align="center" justify="flex-start" style="width: 45vw; margin-top: 10px">
        <var-cell v-for="post in right" :key="post.id">
          <post-card
              :post="contentToPost(post)"
          />
        </var-cell>
      </var-space>
    </var-space>
</template>

<style scoped>

</style>