<script setup lang="ts">
import ChinaMap from "@/views/travel/src/ChinaMap.vue";
import {useLoadingStore} from "@/store/useLoadingStore.ts";
import {computed, onMounted, ref, toRaw} from "vue";
import {mockApiFetch} from "@/utils/mock.ts";
import type {Footprint, TravelDataResponse} from "@/views/travel/src/types.ts";
import {MarkdownRender} from "@/components/markdownRender";

const loadingStore = useLoadingStore();
const rawMockData: TravelDataResponse = {
  footprints: [
    // 北京：修改为具体的区或使用 110100 (市辖区)
    {adcode: 110105, name: '朝阳区', articleCount: 15, visited: true, articles: ['demo1', 'demo2']},
    // 上海：修改为具体的区
    {adcode: 310115, name: '浦东新区', articleCount: 8, visited: true, articles: ['demo1', 'demo2']},
    // 杭州：330100 是杭州市本级
    {
      adcode: 330100,
      name: '杭州市',
      articleCount: 12,
      visited: true,
      articles: ['自从19年昆虫记被封，24年昆虫记意外火了起来，大范围破圈，其中有些角色、剧情、细节被人反复推敲揣测，但也有些角色火的莫名其妙。\n' +
      '\n' +
      '比如商心慈。\n' +
      '\n' +
      '在小说中，谢晗沫可以说是“善良”的化身，是主角方源的白月光。而能与谢晗沫的“善良”相提并论的就是商心慈。\n' +
      '\n' +
      '商心慈，所属南疆超级势力商家，乃是商家族长的私生女。在落难后商心慈组建一支商队，离开母族张家，来到商家，从张心慈改名商心慈。\n' +
      '\n' +
      '混入商队的方源发现商心慈的身份，于是暗中谋害了商心慈的护卫，故意引来兽群冲击商队，最后导致商队全军覆没，在这个过程中方源表现出“有恩报恩，有仇报仇”的性情男儿的魅力，同时多次救商心慈于水火之中。（水火哪里来的不要问）\n' +
      '\n' +
      '而商心慈也对方源有了好感。\n' +
      '\n' +
      '到了商家后，方源又帮助商心慈成为并坐稳商家少主之位。\n' +
      '\n' +
      '在方源离开商家时，商心慈十里相送。\n' +
      '\n' +
      '“黑土哥哥，三叉山危险，请珍重！“\n' +
      '\n' +
      '商心慈在这里并没有喊方源的名字，而是喊方源在商队时的化名“黑土”。\n' +
      '\n' +
      '商心慈把方源看的很重，而方源呢。\n' +
      '\n' +
      '方源为什么要暗杀商心慈的护卫，吸引兽群冲击商队，然后再出手护卫商心慈？\n' +
      '\n' +
      '答案就一个，商心慈有利用价值。方源是重生者，他知道商心慈来到商家后，立刻就会被商家族长认出，因为商家族长对商心慈和其母亲的亏欠，商家族长更疼爱商心慈这个私生女。\n' +
      '\n' +
      '而方源此番作为只是笼络与商心慈的关系，没有条件创造条件也要笼络关系，所以才有了这番作为。\n' +
      '\n' +
      '商心慈要是知道对自己来说护卫兼亲切长辈的老蛊师是被方源杀的，或许以商心慈的心肠，她会考虑方源终究在兽群中保护了自己而放过方源，如果她知道连兽群都是方源引来的，那估计真的要翻脸了。\n' +
      '\n' +
      '好的，方源与商心慈笼络关系，那为什么要笼络呢？为了销赃。\n' +
      '\n' +
      '方源想到以后行走魔道，免不了杀人放火，手里的赃物总是要有个地方出手，而以商业闻名南疆的商家就是最好的地方，而商心慈就是流落在外，最易接触的商家族人中地位最高的。\n' +
      '\n' +
      '方源笼络商心慈就是想让商心慈帮自己销赃，后来方源去往中洲，拥有狐仙福地，直接沟通宝黄天，宝黄天堪称蛊师世界的淘宝闪购，商心慈的销赃作用也就失去了。\n' +
      '\n' +
      '是以在方源离开商心慈后的几百章内容里，方源再没提商心慈，就好像彻底忘记这个人了一样。\n' +
      '\n' +
      '直到方源成为七转以下第一人时，许多蛊仙才注意到与方源有关系的商心慈，商心慈也是这里才知道自己的黑土哥哥不叫“方正”，而是叫“方源”。\n' +
      '\n' +
      '无论是在商队，还是在商家，方源都没有告诉商心慈自己的真名，而就是这样子，商心慈还说着“我要帮黑土哥哥”。\n' +
      '\n' +
      '在拉一个人来做对照组，赵怜云，她与马鸿运相爱，但大多数读者并不喜欢他，还总是骂她恋爱脑、甲级战犯。\n' +
      '\n' +
      '在我看来，商心慈和赵怜云一样，都是恋爱脑。\n' +
      '\n' +
      '方源从始至终对商心慈只是利用，而商心慈跟中了魔一样天天“黑土哥哥”。\n' +
      '\n' +
      '赵怜云和马鸿运好歹还是两情相悦，爱的死去活来。\n' +
      '\n' +
      '赵怜云的败笔只在他爱的不是主角，要是写赵怜云爱方源，她的评价就不会那么低了。\n' +
      '\n' +
      '对于这两个人，我都讨厌。\n' +
      '\n' +
      '另一个人，太白云生，方源视其为工具人的行为更赤裸了，但还是有读者喜欢太白云生。\n' +
      '\n' +
      '什么地灵认主条件。\n' +
      '\n' +
      '“一个蛊师来到一片无主福地，一个白发老头形象的地灵出现，说我的认主条件只有一个，那就是与师弟重归于好。”\n' +
      '\n' +
      '然后评论区里就会有一大堆人发“老白”，在配个大哭的表情图。\n' +
      '\n' +
      '还是利用，方源为了抢江山如故仙蛊，逼迫太白云生升仙，然后在伪装成太白云生的师弟。\n' +
      '\n' +
      '在对付羽民时，方源更是直接表示“竖子不足与谋”。\n' +
      '\n' +
      '最后在逆流河中，方源说了一句“老白，还记得王庭福地吗”，太白云生一时失神，方源抓住战机，一顿拳打脚踢，打断太白云生的骨头，戳瞎其双眼，最后沉入河底，死了。\n' +
      '\n' +
      '即便方源说了这句话，我也不认为方源真的和太白云生相处出什么感情来了。更多是利用这点来快速解决战斗罢了。\n' +
      '\n' +
      '从商心慈和太白云生这两个人来看，凡是与方源有亲密关系的，基本都建立在方源的欺骗之上。\n' +
      '\n' +
      '方源欺骗商心慈，成为她的救命英雄。\n' +
      '\n' +
      '方源欺骗太白云生，谎称是太白云生的师弟。\n' +
      '\n' +
      '哦，除了风天语，风天语是真崇拜方源，不过方源从始至终不知道有这么个人存在罢了。\n' +
      '\n' +
      '哪有什么纯粹的感情，人与人之间不过是你利用我，我利用你罢了。\n' +
      '\n' +
      '利用有什么不好呢，被人利用说明被人需要，不被任何人利用，那不成废物了？\n' +
      '\n' +
      '就算是现实中那些情侣也不过是相互利用罢了，不然怎么有情绪价值这个词呢。\n' +
      '\n' +
      '这也算是我最讨厌的几个词之一。\n' +
      '\n' +
      '如果一个人说自己提供情绪价值，反之就是除了情绪价值之外，什么都没有，纯纯废物一个，以至于只能拿情绪价值这个词来标榜自己，并且还要卖高价。', '我越来越发现很多事情都比较反直觉。好的东西不要钱，反倒是那些残次品会拼命吆喝，试图卖出高价。\n' +
      '\n' +
      '而花高价买残次品的人还不少，我不会可怜他们，反而会骂他们活该。\n' +
      '\n' +
      '以为有钱就能解决问题、为所欲为的人都是蠢货。\n' +
      '\n' +
      '钱买不到的东西多的是，比如信任。\n' +
      '\n' +
      '我不会信他们的话，也不会相信他们所许下的任何承诺。\n' +
      '\n' +
      '我当初答应，只是我想到了自己被拒绝时的痛苦，于是我选择答应。\n' +
      '\n' +
      '但结果是，我感觉自己被戏耍了，我感觉自己被作贱了。\n' +
      '\n' +
      '好贱，看着对方占尽便宜后在摆出一副楚楚可怜的模样，我简直就要被气昏过去。']
    },
    // 成都：510100 是成都市本级
    {adcode: 510100, name: '成都市', articleCount: 5, visited: true, articles: ['demo1', 'demo2']},
    // 广州：440100 是广州市本级
    {adcode: 440100, name: '广州市', articleCount: 2, visited: true, articles: ['demo1', 'demo2']},
    // 南京：320100 是南京市本级
    {adcode: 320100, name: '南京市', articleCount: 0, visited: false, articles: ['demo1', 'demo2']},
  ],
  routes: [
    {id: 'r1', fromAdcode: 110105, toAdcode: 310115}, // 朝阳 -> 浦东
    {id: 'r2', fromAdcode: 310115, toAdcode: 440100}, // 浦东 -> 广州
    {id: 'r3', fromAdcode: 330100, toAdcode: 510100}, // 杭州 -> 成都
  ]
};
const travelData = ref<TravelDataResponse>({footprints: [], routes: []});
const noteData = ref<string[]>([]);
const selectedCityAdcode = ref<number | null>(null);
const footprintMap = computed(() => {
  const map: Record<number, Footprint> = {};
  if (travelData.value?.footprints) {
    travelData.value.footprints.forEach(fp => {
      map[fp.adcode] = fp;
    });
  }
  return map;
});

const hasNotesForSelectedCity = computed(() => {
  if (!selectedCityAdcode.value) return false;
  const cityInfo = footprintMap.value[selectedCityAdcode.value];
  // 只有当用户去过，且关联的文章/笔记数组不为空时才展开
  return !!(cityInfo && cityInfo.visited && cityInfo.articles && cityInfo.articles.length > 0);
});

const handleCityClick = (cityProperties: any) => {
  const adcode = cityProperties.adcode;

  // 如果点击的是已经选中的城市，则再次点击关闭它（收起笔记栏）
  if (selectedCityAdcode.value === adcode) {
    selectedCityAdcode.value = null;
  } else {
    selectedCityAdcode.value = adcode;

    // 【此处可扩展】：根据 adcode 向后端异步请求该城市的详细笔记内容
    const cityInfo = footprintMap.value[adcode];
    if (cityInfo && cityInfo.articles) {
      // 模拟加载对应城市的笔记
      noteData.value = toRaw(cityInfo.articles);
    } else {
      noteData.value = [];
    }
  }
};

onMounted(async () => {
  travelData.value = await mockApiFetch(rawMockData, 800)
  loadingStore.endLoading()
})
</script>

<template>
  <div class="travel">
    <div class="header-section">
      <h2>我的足迹</h2>
      <p class="subtitle">记录走过的每一座城市</p>
    </div>

    <div class="content-section" :class="{ 'layout-split': hasNotesForSelectedCity }">
      <section class="map-paper-container">
        <china-map :data="travelData" @click-city="handleCityClick"/>
      </section>
      <section class="note-paper-container">
        <div class="note-header">
          <h3>{{ footprintMap[selectedCityAdcode]?.name }} · 旅行笔记</h3>
          <button class="close-btn" @click="selectedCityAdcode = null">✕</button>
        </div>

        <div class="note-scroll-area">
          <markdown-render
              v-for="(note, index) in noteData"
              :key="index"
              :content="note"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.travel {
  width: 100%;
  padding: var(--content-padding-L);
  margin: 0 auto;
  min-height: 100vh;
}

.header-section {
  margin-bottom: 40px;
  text-align: center;
}

.subtitle {
  color: var(--color-text-primary);
  opacity: 0.6;
  font-size: 14px;
  margin-top: 8px;
}

.content-section {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 50% 0fr 1fr;
  height: 80vh;
  gap: 24px;
  overflow: hidden;
  transition: grid-template-columns 0.5s ease;
}

.content-section.layout-split {
  grid-template-columns: 0fr 50% 1fr 0fr;
}

/* 核心优化：地图“纸张”容器 */
.map-paper-container {
  grid-column: 2 / 3;
  overflow: hidden;
  background: var(--color-container-bg);
  border: 1px solid var(--color-border);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.05),
  0 4px 20px -5px rgba(0, 0, 0, 0.03);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* 深色模式下的阴影加强 */
:deep(.dark) .map-paper-container {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  background: rgba(30, 30, 30, 0.6); /* 更加深邃的半透明感 */
}

.note-paper-container {
  grid-column: 3 / 4;
  background: var(--color-container-bg);
  overflow-y: scroll;
  opacity: 0;
  border: 1px solid var(--color-border);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
}

.layout-split .note-paper-container {
  padding: 24px;
  opacity: 1;
  pointer-events: auto;
  user-select: auto;
  -webkit-user-select: auto;
  -moz-user-select: auto;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 12px;
}

.note-header h3 {
  margin: 0;
  font-family: var(--font-h);
  color: var(--color-text-h);
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-primary);
  opacity: 0.5;
  cursor: pointer;
  font-size: 16px;
  transition: opacity 0.2s;
}

.close-btn:hover {
  opacity: 1;
}

.note-scroll-area {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
}
</style>