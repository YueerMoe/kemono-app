<script setup lang="ts">

const props = defineProps({
  commenter_name: String,
  commenter: String,
  reply: String,
  content: String,
  published: String,
})

</script>

<template>
  <var-card
      style="
      display: flex;
      justify-content: flex-start;
      flex-direction: column;
      align-items: center;
      --card-padding: 10px 0 10px 0;
"
      layout="column"
      :elevation="false"
  >
    <template #title>
      <var-space direction="row" justify="space-between">
        <div class="comment-title">
          <span class="name">{{ props.commenter_name }}</span>
          <span class="id">(ID:{{ props.commenter }})</span>
        </div>
        <div>{{ props.published}}</div>
      </var-space>
    </template>
    <template #subtitle>
      <div>
        {{ $t('comment.reply')}}:
        <span style="color: var(--color-primary)">@{{ props.reply }}</span>
      </div>
    </template>
    <template #description>
      <div>
        {{ props.content }}
      </div>
    </template>
  </var-card>
</template>

<style scoped>
.comment-title .name{
  font-size: 16px;
  font-weight: bold;
}
.comment-title .id{
  font-size: 16px;
}
</style>