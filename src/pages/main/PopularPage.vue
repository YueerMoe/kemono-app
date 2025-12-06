<script setup lang="ts">
import {onMounted, ref} from "vue";
import {Post} from "../../lib/interface/post.ts";
import {getPopular} from "../../lib/request.ts";
import PostCard from "../../components/PostCard.vue";
import {splitArrayByParity} from "../../lib/cat.ts";


const left = ref<Post[]>([])

const right = ref<Post[]>([])

const page = ref(1)

const loading = ref(true);

const finish = ref(false);

const getPosts = (async () => {

  const res = await getPopular(page.value);

  const d = res.posts;

  const [l, r] =  await splitArrayByParity(d)

  left.value.push(...l)

  right.value.push(...r)

  loading.value = false

  if(10 == page.value){

    finish.value = true;

  }else{
    page.value += 1;
  }

})

async function load(){
  loading.value = true;
  await getPosts();
}

onMounted(async () => {
  loading.value = true;
  await load();
})

</script>

<template>
  <div>
    <var-app-bar
        color="transparent"
        text-color="var(--color-text)"
        :elevation="false"
    >
      <h2>{{ $t('popular.title') }}</h2>
    </var-app-bar>
    <var-list
        @load="load"
        v-model:loading="loading"
        :finished="finish"
        :offset="0"
        :finished-text="$t('List.finish')"
        :loading-text="$t('List.loading')"
    >
      <var-space direction="row" justify="center">
        <var-space direction="column" align="center" style="width: 46vw">
          <var-cell v-for="post in left" :key="post.id">
            <post-card
                :post="post"
            />
          </var-cell>
        </var-space>
        <var-space style="width: 46vw;">
          <var-cell v-for="post in right" :key="post.id">
            <post-card
                :post="post"
            />
          </var-cell>
        </var-space>
      </var-space>
    </var-list>
  </div>
</template>

<style scoped>

</style>