<script setup lang="ts">

import {onMounted, ref} from "vue";
import {Announcement} from "../../lib/interface/announcement.ts";
import {getAnnouncements} from "../../lib/request.ts";
import {useRoute} from "vue-router";
import {Service} from "../../lib/interface/service.ts";
import {formatLocalDateTime} from "../../lib/cat.ts";

const announcements = ref<Announcement[]>([]);
const loading = ref(true);
const route = useRoute();

onMounted(async () => {
  loading.value = true;
  announcements.value = await getAnnouncements(<Service>route.params.service, <string>route.params.user)
  loading.value = false;
})


</script>

<template>
  <var-loading v-if="loading" />
  <var-space direction="column" justify="center" align="center" v-else>
    <var-card v-for="announcement in announcements">
      <template #description>
        <div v-html="announcement.content" class="comments"></div>
      </template>
      <template #extra>
        {{ formatLocalDateTime(new Date(announcement.published || new Date())) }}
      </template>
    </var-card>
    <var-result class="result" type="empty" :description="$t('result.nothing.title')" v-if="announcements.length === 0" style="margin-top: 100px"/>
  </var-space>
</template>
<style>
.comments{
  white-space: pre-wrap;
  padding: 10px;
}
</style>
<style scoped>

</style>