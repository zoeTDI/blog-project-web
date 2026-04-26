<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useLoadingStore} from "@/store/useLoadingStore.ts";
import {CaRow} from "@/components/ca/CaRow";
import {CaCol} from "@/components/ca/caCol";
import {CaSection} from "@/components/ca/caSection";

const route = useRoute();
const loadingStore = useLoadingStore();


const getTagName = () => {
  return route.query?.name || 'UNDEFINED';
}

onMounted(() => {

  loadingStore.endLoading();
})

</script>

<template>
  <div class="by-tag">
    <ca-row>
      <ca-col>
        <ca-section :title="`标签 / TAG ${getTagName()}`"></ca-section>
      </ca-col>
    </ca-row>
    <ca-row>
      <ca-col>

      </ca-col>
      <ca-col>

      </ca-col>
    </ca-row>
  </div>
</template>

<style scoped>

</style>