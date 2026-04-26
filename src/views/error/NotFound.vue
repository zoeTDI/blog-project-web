<script setup lang="ts">
import {useLoadingStore} from "@/store/useLoadingStore.ts";
import {onMounted} from "vue";
import {CaButton} from "@/components/ca/caButton";
import {ArrowLeftIcon} from "@heroicons/vue/24/outline";
import {useRouter} from "vue-router";
import {ROUTER_NAMES} from "@/router/routerNames.ts";

const loadingStore = useLoadingStore();
const router = useRouter();

const backToHome = () => {
  router.push({name: ROUTER_NAMES.HOME});
}

onMounted(() => {
  loadingStore.endLoading();
})
</script>

<template>
  <div class="not-found">
    <div class="not-found-wrapper">
      <div class="sign">404</div>
      <div class="description">
        <p>抱歉，页面未找到 / SORRY, PAGE NOT FOUND</p>
        <p>您访问的页面可能已被移动、删除或输入有误</p>
      </div>
      <div class="back-button-wrapper">
        <ca-button :icon="ArrowLeftIcon" :hover-effect="'expand'" @click="backToHome">返回首页 / BACK TO HOME</ca-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  width: var(--content-max-width);
  margin: auto;
  padding: var(--content-padding);
}

.not-found-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.sign {
  position: relative;
  line-height: 1;
  font-size: 270px;
  font-family: var(--mono);
  color: var(--text-h);
  z-index: 100;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
}

.sign::after {
  content: '';
  position: absolute;
  display: block;
  width: 105%;
  height: 45%;
  left: 50%;
  top: 50%;
  border-radius: 10px;
  z-index: -1;
  transform: translate(-50%, -40%);
  background-color: var(--accent);
  opacity: 0.4;
}

.description {
  width: max-content;
}

.description p {
  line-height: 2;
  text-align: center;
  font-size: 32px;
  font-family: var(--sans);
  color: var(--text-h);
}

.description p:nth-child(2) {
  font-size: 24px;
}

.back-button-wrapper {
  margin-top: 80px;
}
</style>