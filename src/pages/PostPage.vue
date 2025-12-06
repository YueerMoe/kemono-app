<script setup lang="ts">

import {shareText} from "@buildyourwebapp/tauri-plugin-sharesheet";
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {download_file, getProfile, Profile, getPost} from "../lib/request.ts";
import {PostContent} from "../lib/interface/PostContent.ts";
import PictureView from "../components/PictureView.vue";
import Comments from "../components/Comments.vue";
import FavoriteButton from "../components/FavoriteButton.vue";
import {openUrl} from "@tauri-apps/plugin-opener";
import LikeButton from "../components/LikeButton.vue";
import {processHtmlText} from "../lib/postHtmlProcess.ts";
import {formatLocalDateTime} from "../lib/cat.ts";
import {Attachment} from "../lib/interface/post.ts";
import VideoCard from "../components/VideoCard.vue";

const service = ref()
const user = ref()
const id = ref()
const router = useRouter();
const route = useRoute();

const profile = ref<Profile>();
const post = ref<PostContent>()
const previews = ref([{
  type: "",
  server: "",
  name: "",
  path: ""
}])

const files = ref<Attachment[]>([])

const videos = ref([
  {
    index: 0,
    path: "",
    name: "",
    extension: "",
    name_extension: "",
    server: ""
  }
])

const loading = ref(true)

function extractFanboxId(url: string): string | null {
  // 匹配固定的域名结构，并捕获最后面的数字 ID
  const regex = /https:\/\/www\.fanbox\.cc\/@erosenro\/posts\/(\d+)/;

  // 使用 match() 方法
  const matchResult = url.match(regex);

  // matchResult 数组的结构：
  // [0] 是完整的匹配字符串
  // [1] 是第一个捕获组的内容 (我们需要的 ID)

  if (matchResult && matchResult.length > 1) {
    // 返回第一个捕获组的内容，即 6452616
    return matchResult[1];
  }

  // 如果 URL 不符合预期结构，返回 null
  return null;
}

const back = ()=>{
  router.go(-1)
}

function handleLinkClick(link: string){
  const pid = extractFanboxId(link)
  if(pid){
    router.push({name: 'post', params: {id: pid, user: user.value, service: service.value}});
  } else{
    openUrl(link)
  }
}

onMounted(async () => {
  // @ts-ignore
  window.handleLinkClick = handleLinkClick
  loading.value = true
  id.value = route.params.id;
  service.value = route.params.service;
  user.value = route.params.user;

  try {
    profile.value = await getProfile(service.value, user.value);
    // 使用 profile...
  } catch (e) {
    await router.push({ name: 'error', query: { message: (e as Error).message } });
  }

  loading.value = true;

  const data = await getPost(service.value, user.value, id.value)

  if (!data){
    await router.replace({name: 'error'});
  }

  post.value = data['post']
  previews.value = data['previews']
  videos.value = data['videos']
  files.value = data['attachments']

  loading.value = false
})

</script>

<template>
  <div v-if="loading">
    <var-loading />
  </div>
  <div v-else class="post-box">
    <var-back-top :duration="300"/>
    <var-app-bar
        color="var(--color-profile-background)"
        text-color="black"
        fixed
        :placeholder="true"
        :elevation="false"
        z-index="999"
        style="height: 50px;"
        :safe-area-top="true"
    >
      <template #left>
        <var-button round text @click="back()">
          <var-icon name="arrow-left" namespace="i" :size="30"/>
        </var-button>
      </template>
      <template #right>
        <var-button
            round
            text
            style="margin-right: 8px"
            @click="shareText(`${post?.title}\nhttps://kemono.cr/${service}/user/${user}/post/${id}`)"
        >
          <var-icon namespace="i" name="share-variant" :size="24" color="var(--color-text)"/>
        </var-button>
        <like-button :id="post?.id" :user="post?.user" :service="post?.service" :size="24"/>
        <var-button round text>
          <var-icon name="dots-vertical" :size="24" color="var(--color-text)"/>
        </var-button>
      </template>
    </var-app-bar>
    <var-card style="--card-padding: 0 7px 10px 7px" :elevation="false">
      <template #title>
        <h3 style="padding-left: 7px; padding-right: 7px; padding-top: 7px">{{ post?.title }}</h3>
      </template>
      <template #subtitle>
        <var-sticky :offset-top="98">
        <var-space justify="space-between" align="center" style="background: var(--color-body)">
          <var-space align="start" justify="flex-start"
                     style="padding: 0 7px 0 7px; height: 50px;"
                     @click="router.push({name: 'artist', params: {user: profile?.id, service: profile?.service}})">
            <var-avatar
                color="#fff"
                size="40"
                :src="'https://img.kemono.cr/icons/'+profile?.service+'/'+profile?.id"
            />
            <var-space
                direction="column"
                justify="space-between"
                align="start"
                style="font-size: 12px; height: 40px;--space-size-normal-y: 0"
            >
              <div style="font-size: 18px">
                {{ profile?.name }}
              </div>
              <div style="line-height: 12px">
                {{ $t('post.edited' )}}:{{ formatLocalDateTime(new Date(post?.edited || new Date())) }}
              </div>
            </var-space>
          </var-space>
          <favorite-button
              :id="profile?.id"
              :service="profile?.service"
          ></favorite-button>
        </var-space>
        </var-sticky>
      </template>
      <template #default>
        <div class="post-content" v-html="processHtmlText(post?.content || '')"></div>
      </template>
      <template #extra>
        <div style="font-size: 14px">
          {{ $t('post.published' )}}:{{ formatLocalDateTime(new Date(post?.published || new Date()))}}
        </div>
      </template>
      <template #description>
        <var-space direction="column" align="center" v-if="previews">
          <picture-view :images="previews" />
        </var-space>
        <var-space direction="column" align="center" v-if="videos">
          <video-card
              :key="video.name"
              :video="`${video.server}/data${video.path}`"
              :preview="`https://img.kemono.cr/thumbnail/data${previews[0].path}`"
              v-for="video in videos"
              style="width: 96vw"
          />
        </var-space>
        <div>
          <var-button text :key="file" v-for="file in files" @click="download_file(
                          `${file.server}/data${file.path}?f=${file.name}`,
                          `${file.name}`)">
            <var-cell>
              <template #icon>
                <var-icon namespace="i" name="paperclip" size="24" />
              </template>
              <var-ellipsis style="width: 80vw" v-text="file.name"></var-ellipsis>
              <template #extra>
                <var-icon name="download" />
              </template>
            </var-cell>
          </var-button>
        </div>
      </template>
    </var-card>
    <div class="comment-box" v-show="profile?.name" v-if="post?.id">
      <comments :id="id" :user="profile?.id" :name="profile?.name" :service="profile?.service">
      </comments>
    </div>
  </div>
</template>

<style>
.post-content{
  font-size: 17px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.post-content a {
  overflow-wrap: break-word;
  word-break: break-all;
  color: var(--color-primary);
}
.post-content img{
  max-width: 100%;
}
.post-content iframe{
  max-width: 100vw;
}
.post-box{
  display: flex;
  flex-direction: column;
  margin-top: -54px;
}
</style>

<style scoped>
.comment-box{
  display: flex;
  flex-direction: column;
}
</style>