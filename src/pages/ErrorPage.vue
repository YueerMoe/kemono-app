<script setup lang="ts">

import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";

const route = useRoute();
const router = useRouter();
const message = ref('')
const from = ref('')
onMounted(()=>{
  from.value = route.query.from as string;
  message.value = route.query.message as string;
})

</script>

<template>
  <var-result
      :title="$t('result.error.title')"
      type="error"
      style="margin-top: 20vh"
  >
    <template #description>
      <p>From: {{ from }}</p>
      <p>
        {{ message || $t('result.error.message') }}
      </p>
    </template>
    <template #footer>
      <var-button text @click="router.go(-1)">
        <var-chip size="large" color="var(--color-primary-container)" text-color="var(--color-primary-text)">
          {{ $t('result.error.back') }}
        </var-chip>
      </var-button>
    </template>
  </var-result>
</template>

<style scoped>

</style>