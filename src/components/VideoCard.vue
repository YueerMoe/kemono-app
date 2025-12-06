<script setup lang="ts">

import { VideoPlayer } from '@videojs-player/vue'
import 'video.js/dist/video-js.css'
import {nextTick, onMounted, onUnmounted, ref} from "vue";

const props = defineProps({
  video: String,
  preview: String,
})

const box = ref()
const w = ref(0)
const h = ref(0)

let observer: ResizeObserver | null = null;

onMounted(async () => {

  await nextTick();

  observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
    const entry = entries[0];
    w.value = entry.contentRect.width;
    h.value = (w.value / 16) * 9;
  });

  if (box.value) {
    observer.observe(box.value);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect(); // 记得销毁，防止内存泄漏
  }
});
</script>

<template>
  <div style="width: 100%;" ref="box">
    <video-player
        :src="props.video"
        :poster="preview"
        controls
        :width="w"
        :height="h"
        :volume="0.6"
    />
  </div>

</template>

<style scoped>

</style>