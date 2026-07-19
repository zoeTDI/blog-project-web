<script setup lang="ts">
  import { MomentInputer } from '@/components/momentInputer';
  import MomentItem from '@/views/moments/space/MomentItem.vue';
</script>

<template>
  <div class="moments-space">
    <section class="inputer">
      <moment-inputer />
    </section>
    <section class="item__contaienr">
      <MomentItem
        :data="{
          id: 1,
          content:
            '很\n\n多内\n\n容\n\n\n很多\n\n内\n\n容\n\n很多\n\n内\n\n容\n\n很1\n\n23\n\n21',
          imageList: [
            { id: 1, url: 'https://picsum.photos/seed/20260629221208/200/200' },
            { id: 2, url: 'https://picsum.photos/seed/20260629221208/200/200' },
            { id: 3, url: 'https://picsum.photos/seed/20260629221208/200/200' },
          ],
          meta: {
            viewCount: 0,
            likeCount: 0,
            commentCount: 0,
          },
        }" />
      <MomentItem
        :data="{
          id: 1,
          content:
            '很多内容很多内容很多\n\n内很多内容很多内容',
          imageList: [
            { id: 1, url: 'https://picsum.photos/seed/20260629221208/200/200' },
          ],
          meta: {
            viewCount: 0,
            likeCount: 0,
            commentCount: 0,
          },
        }" />
    </section>
  </div>
</template>

<style scoped>
  .moments-space {
    outline: 1px solid #fff;
    width: 100%;
    height: 100%;
    overflow: scroll;
    scrollbar-width: none;
  }
</style>
