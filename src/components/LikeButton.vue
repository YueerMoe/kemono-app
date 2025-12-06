<script setup lang="ts">

import {onMounted, ref} from "vue";
import {useFavoritedPostStore} from "../store/favotitedPostStore.ts";

const f = useFavoritedPostStore()
const props = defineProps({
  id: String,
  user: String,
  service: String,
  size: Number,
})

const favorited = ref(false)

const f_req = async ()=>{
  f.favorite(props.id as string, props.user as string, props.service as string)
}

onMounted(async () => {
  favorited.value = await f.isFavorited(props.id as string);
})

</script>

<template>
  <var-button round text @click="f_req">
    <var-icon name="star" v-if="favorited" :size="props.size" />
    <var-icon name="star-outline" v-else :size="props.size" />
  </var-button>
</template>

<style scoped>

</style>