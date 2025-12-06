<script setup lang="ts">

import ArtistCard from "../../components/ArtistCard.vue";
import {onMounted, ref} from "vue";
import {ArtistProfile} from "../../lib/interface/artist.ts";
import {useFavoritedArtistStore} from "../../store/favoritedArtistStore.ts";

const f = useFavoritedArtistStore()

const favorite_list = ref<ArtistProfile[]>([])
const get_f_list = async () => {
  favorite_list.value = await f.fetchFavoritedArtistList();
}
onMounted(async () => {
  await get_f_list()
})
</script>

<template>
  <var-space direction="column" justify="center" align="center" style="width: 100%;">
    <artist-card
        style="margin-bottom: 10px"
        v-for="a in favorite_list" :key="a.id"
        :service="a.service"
        :id="a.id"
        :name="a.name"
        :favorited="a.faved_seq"
        :indexed="a.indexed"
        :updated="a.updated"
    />
  </var-space>
</template>

<style scoped>

</style>