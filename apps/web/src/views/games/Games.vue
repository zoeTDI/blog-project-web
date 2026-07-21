<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { mockApiFetch } from '@/utils/mock.ts';
  import { CaRow, CaCol } from '@caldm/ui';
  import { ROUTER_NAMES } from '@/router/routerNames.ts';

  const mockData: { id: string; url: string; alt?: string }[] = [
    {
      id: '1',
      url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260523160825692.webp',
      alt: 'Factorio',
    },
    {
      id: '2',
      url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260523160825693.webp',
      alt: '戴森球计划',
    },
    {
      id: '3',
      url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260523160825694.webp',
      alt: '鬼谷八荒',
    },
    {
      id: '4',
      url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260523160825695.webp',
      alt: '只狼',
    },
    {
      id: '5',
      url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260523160825696.webp',
      alt: '赛博朋克：2077',
    },
    {
      id: '6',
      url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260523160825707.webp',
      alt: '巫师三',
    },
    {
      id: '7',
      url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260523160825690.webp',
      alt: '放松时光',
    },
    {
      id: '8',
      url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260523160825691.webp',
      alt: 'warframe',
    },
    {
      id: '9',
      url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260523160825697.webp',
      alt: '黑神话：悟空',
    },
    {
      id: '10',
      url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260523160825698.webp',
      alt: '空洞骑士',
    },
    {
      id: '12',
      url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260523160825699.webp',
      alt: '暖雪',
    },
    {
      id: '13',
      url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260523160825700.webp',
      alt: '了不起的修仙模拟器',
    },
    {
      id: '14',
      url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260523160825701.webp',
      alt: '龙崖',
    },
    {
      id: '11',
      url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260523160825702.webp',
      alt: 'Noita',
    },
    {
      id: '15',
      url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260523160825703.webp',
      alt: '古墓丽影',
    },
    {
      id: '16',
      url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260523160825704.webp',
      alt: '刺客信条：大革命',
    },
    {
      id: '17',
      url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260523160825705.webp',
      alt: '命运石之门',
    },
    {
      id: '18',
      url: 'https://ob-tc-caldm-1315806820.cos.ap-nanjing.myqcloud.com/blog/20260523160825706.webp',
      alt: 'OPUS MAGNUM',
    },
  ];
  const baseData = ref<{ id: string; url: string; alt?: string }[]>([]);

  onMounted(async () => {
    baseData.value = await mockApiFetch(mockData, 800);
  });
</script>

<template>
  <div class="games">
    <header class="page-header">
      <div class="header-wrapper">
        <h1 class="title">游戏画廊</h1>
        <p class="description">这里精选了一些我玩过的游戏。</p>
      </div>
    </header>
    <section class="game-list">
      <ca-row :gap="20">
        <ca-col
          v-for="item in baseData"
          :key="item.id"
          :span="6">
          <router-link
            :to="{ name: ROUTER_NAMES.GAME_DETAIL, params: { id: item.id } }">
            <img
              :src="item.url"
              :alt="item?.alt || 'none'" />
          </router-link>
        </ca-col>
      </ca-row>
    </section>
  </div>
</template>

<style scoped>
  .games {
    width: 100%;
    max-width: var(--content-max-width-M);
    padding: var(--content-padding-L);
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-wrapper {
    flex: 1 1 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .title {
    font-size: 2.5rem;
    font-weight: 800;
    font-family: var(--font-h);
    margin-bottom: 16px;
    background: linear-gradient(90deg, #fff, #888);
    -webkit-background-clip: text;
  }

  .description {
    font-family: var(--font-text);
    font-size: 1.1rem;
    line-height: 1.6;
    color: #aaa;
  }

  .game-list {
    margin-top: 60px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
