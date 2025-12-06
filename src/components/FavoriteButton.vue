<script setup lang="ts">

import {onMounted, ref} from "vue";
import {useFavoritedArtistStore} from "../store/favoritedArtistStore.ts";

const f = useFavoritedArtistStore()
const props = defineProps({
  id: String,
  service: String,
})

const favorited = ref(false)

const favorite = async ()=>{
  f.favorite(props.service || '', props.id || '')
}

onMounted(async () => {
  favorited.value = await f.isFavorited(props.id || '');
})

</script>

<template>
  <var-button text @click="favorite">
    <var-chip
        v-if="favorited"
        plain
        type="primary"
        size="normal"
        style="--chip-round-radius: 100px">
      {{ $t('artist.favorited') }}
    </var-chip>
    <var-chip
        v-else
        type="primary"
        color="var(--color-primary)"
        text-color="var(--color-on-primary)"
        size="normal"
        style="--chip-round-radius: 100px">
      {{ $t('artist.favorite') }}
    </var-chip>
  </var-button>
</template>

<style scoped>

</style>