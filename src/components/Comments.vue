<script setup lang="ts">

import {onMounted, ref} from "vue";
import CommentCard from "./CommentCard.vue";
import {useRouter} from "vue-router";
import {getComments} from "../lib/request.ts";

const props = defineProps({
  service: String,
  name: String,
  id: String,
  user: String,
})

const loading = ref(true);
const router = useRouter();

interface FlatComment {
  id: string;
  parent_id: string | null;
  commenter: string;
  commenter_name: string;
  content: string;
  published: string;
  revisions: any[];
}

interface NestedComment extends FlatComment {
  // 子评论的类型应该是 NestedComment[]，以便它可以递归嵌套
  sub_comments: NestedComment[];
}

const comments = ref<NestedComment[]>([]);

/**
 * 将扁平化的评论列表转换为嵌套的树形结构。
 *
 * @param comments 扁平化的评论数组 (FlatComment[])
 * @returns 顶层评论的数组 (NestedComment[])
 */
function nestComments(comments: FlatComment[]): NestedComment[] {
  // 1. 定义 Map 的类型: Key 是 string (id)，Value 是 NestedComment
  const commentMap = new Map<string, NestedComment>();
  const roots: NestedComment[] = [];

  // --- 1. 初始化 Map ---
  comments.forEach(item => {
    // 创建一个包含 sub_comments 属性的新对象，并作为 NestedComment 存入 Map
    const nestedItem: NestedComment = { ...item, sub_comments: [] };
    commentMap.set(item.id, nestedItem);
  });

  // --- 2. 组装树结构 ---
  comments.forEach(item => {
    const parentId = item.parent_id;

    // 从 Map 中获取当前评论对象 (保证它是 NestedComment 类型)
    const currentComment = commentMap.get(item.id)!;

    // 如果 parentId 存在
    if (parentId !== null) {
      const parentComment = commentMap.get(parentId);

      if (parentComment) {
        // 如果父级存在，则将当前评论加入到父级的 sub_comments 中
        parentComment.sub_comments.push(currentComment);
      } else {
        // 虽然有 parent_id 但父级找不到 (例如数据错误)，视为顶层评论
        roots.push(currentComment);
      }
    } else {
      // 如果 parent_id 为 null，则视为顶层评论
      roots.push(currentComment);
    }
  });

  return roots;
}

function formatLocalDateTime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // getMonth() 返回 0-11
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}


onMounted(async () => {
  try {
    loading.value = true;

    const res = await getComments(props.service || '', props.user || '', props.id || '');

    comments.value = nestComments(res);

    loading.value = false;

  } catch (e) {
    await router.push({name: 'error', query: {message: (e as Error).message}});
  } finally {
    loading.value = false;
  }
})
</script>

<template>
  <var-divider :description="$t('comment.title')"/>
  <var-loading v-if="loading"/>
  <div v-else v-for="comment in comments" :key="comment.id">
    <div class="comments-box">
      <comment-card
          :commenter="comment.commenter"
          :commenter_name="comment.commenter_name"
          :content="comment.content"
          :published="formatLocalDateTime(new Date(comment.published))"
          :reply="props.name"
          :id="comment.id"
      />
      <div v-for="s_comment in comment.sub_comments">
        <var-divider dashed hairline/>
        <comment-card
            :key="s_comment.id"
            :commenter="s_comment.commenter"
            :commenter_name="s_comment.commenter_name"
            :content="s_comment.content"
            :published="formatLocalDateTime(new Date(s_comment.published))"
            :reply="comment.commenter_name"
            :id="s_comment.id"
        />
      </div>
    </div>
    <var-divider hairline/>
  </div>
  <var-space direction="row" justify="center" style="margin-bottom: 10px">{{ $t('List.finish') }}</var-space>
</template>

<style scoped>
.comments-box{
  padding-left: 15px;
  padding-right: 15px;
}
</style>