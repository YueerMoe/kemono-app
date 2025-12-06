<script setup lang="ts">
import PostCard from "../../components/PostCard.vue";
import {onMounted, ref} from "vue";
import {splitArrayByParity} from "../../lib/cat.ts";
import {BrowseRecord, useBrowseHistoryStore} from "../../store/historyPostStore.ts";
import {useRouter} from "vue-router";
import {Dialog, Snackbar} from "@varlet/ui";
import {t} from "../../i18n";
const left = ref<BrowseRecord[]>([])
const right = ref<BrowseRecord[]>([])

const loading = ref(false);
const history = useBrowseHistoryStore()
const router = useRouter()


onMounted(async () => {

  loading.value = true;

  const res = await history.getBrowseHistory()

  const [l, r] = await splitArrayByParity(res)

  left.value.push(...l)

  right.value.push(...r)

  loading.value = false;
})


async function createAction() {
  const action = await Dialog({
    message: t("confirm.content", t('search.history.clean')),
    cancelButtonText: t("confirm.cancel"),
    confirmButtonText: t("confirm.confirm"),
  })
  if(action === 'confirm') {
    await history.deleteBrowseRecord()
    Snackbar({
      content: "已清空",
      position: "bottom",
    })
  }
}
</script>

<template>
  <var-app-bar
      color="transparent"
      text-color="var(--color-text)"
      :elevation="false"
  >
    <template #left>
    <var-button round text @click="router.go(-1)">
      <var-icon name="arrow-left" namespace="i" :size="30"/>
    </var-button>
  </template>
    <h2 style="margin-left: 15px;">{{$t('user.history')}}</h2>
  </var-app-bar>
  <var-loading v-if="loading" />
  <div v-else>
    <div v-if="left.length > 0">
      <var-space direction="row" justify="center" style="width: 100%">
        <var-space direction="column" align="center" style="width: 45vw; margin-top: 10px">
          <var-cell v-for="post in left" :key="post.post.id">
            <post-card
                :post="post.post"
            />
          </var-cell>
        </var-space>
        <var-space direction="column" align="center" style="width: 45vw; margin-top: 10px">
          <var-cell v-for="post in right" :key="post.post.id">
            <post-card
                :post="post.post"
            />
          </var-cell>
        </var-space>
      </var-space>
      <var-divider :description="t('List.finish')"></var-divider>
      <var-fab inactive-icon="delete" @click="createAction" :bottom="70" :right="20"/>
    </div>
    <var-result v-else class="result" type="empty" :description="$t('result.nothing.title')" style="margin-top: 100px"/>
  </div>

</template>

<style scoped>

</style>