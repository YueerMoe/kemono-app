<script setup lang="ts">

import lazy_img from "../assets/loading.webp";
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {colors} from "../lib/interface/service.ts";
import {Post} from "../lib/interface/post.ts";
import {useBrowseHistoryStore} from "../store/historyPostStore.ts";
const router = useRouter();
import no_image from "../assets/no_image.webp";

interface Props {
  post: Post
}
const props = defineProps<Props>()

function isImageFilename(filename: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
  const lowerFilename = filename.toLowerCase();
  return imageExtensions.some(ext => lowerFilename.endsWith(ext));
}

const has_preview = ref(true)

const color = ref("primary")

onMounted(() => {
  color.value = colors[props.post?.service];
  if (props.post?.file.name === undefined) {
    has_preview.value = false
  }else{
    has_preview.value = isImageFilename(props.post.file?.['name'])
  }
})

const history = useBrowseHistoryStore();

const jump = async () => {
  await history.addBrowseRecord(props.post)
  await router.push({
    name: 'post',
    params: {
      id: props.post.id,
      user: props.post.user,
      service: `${props.post.service}`,
    }
  })
}

</script>

<template>
  <var-card
      @click="jump()"
      style="width: 100%; margin: 1px"
  >
    <template #image>
      <div class="post-preview">
        <var-chip size="small" :color="color" text-color="white" class="post-preview-chip">
          {{ props.post?.service }}
        </var-chip>
        <var-space v-if="!has_preview" direction="column" style="text-align: center" align="center">
          <var-image :src="no_image" fit="contain"></var-image>
          <div style="margin-top: -52px; background: rgba(255, 255, 255, 0.5)">{{ $t('search.result.post.no_preview') }}</div>
        </var-space>
        <var-image
            v-else
            lazy
            :loading="lazy_img"
            :error="no_image"
            :src="'https://img.kemono.cr/thumbnail/data' + props.post?.file.path"
            fit="contain"
            referrerpolicy="no-referrer"
            style="width: 100%"
        >
        </var-image>
      </div>
    </template>
    <template #title>
      <var-ellipsis  style="padding-left: 5px;font-size: 14px; max-width: 35vw;margin-top: 10px">
        {{ props.post?.title }}
      </var-ellipsis>
    </template>
    <template #subtitle>
      <var-space direction="row" style="padding-left: 5px;padding-right: 5px; margin-bottom: -10px" justify="space-between" align="center">
        <var-space justify="space-between" align="center" style="width: 40vw">
          <var-space direction="row" justify="flex-start" align="center">
            <var-icon namespace="i" name="folder-download" size="20"/>
            <div style="margin-left:-6px;margin-top: 3px; font-size: 13px">
              {{ $t('search.result.post.attachment', { files: props.post?.attachments.length || 0 }) }}
            </div>
          </var-space>
        </var-space>
      </var-space>
    </template>
  </var-card>
</template>

<style scoped>
.post-preview{
  position: relative;
  top: 0;
  left: 0;
}
.post-preview-chip{
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>