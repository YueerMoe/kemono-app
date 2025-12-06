<script setup lang="ts">
import {onMounted, ref} from "vue";
import {t} from "../i18n";
import {download_file} from "../lib/request.ts";
import {Preview} from "../lib/interface/post.ts";



interface Props {
  // images 属性是必传的 Preview 数组
  images: Preview[];
}

const props = defineProps<Props>()

let imgs = ref<string[]>([])

const show = ref(false)
const i = ref(0)

const preview = (index: number) => {
  show.value = true
  i.value = index
}

const save = (async ()=>{
  await download_file(imgs.value[i.value], props.images[i.value]['name'])
})

const change = ((index: number) => {
  i.value = index
})

const actions = [
  {
    name: t('picture.save'),
    icon: 'download',
    action: save,
  },
  {
    name: t('picture.share'),
    icon: 'wrench'
  }
]
const m_show = ref(false)


onMounted(() => {

  imgs.value = props.images.map(img => `${img.server}/data${img.path}`)

})

</script>

<template>
  <var-image-preview
      :images="imgs"
      v-model:show="show"
      :initial-index="i"
      @long-press="m_show = true"
      :closeOnKeyEscape="false"
      @change="change"
  >
    <template #extra>
      <var-bottom-navigation
          :fixed="true"
          style="--bottom-navigation-background-color: transparent"
      >
        <template #default>
          <div class="bottom-bar">
            <var-space justify="space-between">
              <var-space>
                <var-icon name="image-multiple-outline" namespace="i" color="#fff" />
                <div style="color: #fff">{{ i + 1 }}</div>
                <div style="color: #fff">/</div>
                <div style="color: #fff">{{ props.images?.length }}</div>
              </var-space>
              <var-space>
                <var-button text :ripple="false" @click="save">
                  <var-icon name="tray-arrow-down" namespace="i" color="#fff" size="26"/>
                </var-button>
              </var-space>
            </var-space>
          </div>
        </template>
      </var-bottom-navigation>
      <var-action-sheet :actions="actions" v-model:show="m_show" >
        <template #title>
          <div></div>
        </template>
      </var-action-sheet>
    </template>
  </var-image-preview>
  <var-image
      :key="image"
      v-for="(image, index) in images"
      :src="`https://img.kemono.su/thumbnail/data${image?.path}`"
      @click="preview(index)"
      style="margin: 0 10px 20px;"
  />
</template>

<style scoped>
.bottom-bar{
  position: absolute;
  bottom: 0;
  height: 70px;
  width: 100vw;
  padding-left: 20px;
  padding-right: 20px;
  background: rgba(0, 0, 0, 0.5);
}
</style>