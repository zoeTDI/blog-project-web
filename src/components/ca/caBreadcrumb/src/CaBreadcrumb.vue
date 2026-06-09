<script setup lang="ts">
import {useRoute, useRouter, type RouteRecordRaw} from "vue-router";
import {computed} from "vue";
import {ChevronDoubleRightIcon} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const matched = computed(() => route.matched)
const jumpTo = (route: RouteRecordRaw) => {
  router.push(route)
}
</script>

<template>
  <nav class="ca-breadcrumb">
    <ol class="breadcrumb-list" v-if="matched.length > 1">
      <li class="item" v-for="(route, index) in matched" :key="route.path">
        <span :class="['text', { 'is-last': index === matched.length - 1 }]"
          @click="jumpTo(route)">
          {{ route.meta.title }}
        </span>
        <div class="suffix" v-if="index !== matched.length - 1">
          <chevron-double-right-icon/>
        </div>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumb-list {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.text {
  position: relative;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  cursor: pointer;
  transition: all ease 150ms;
}

.suffix {
  width: 16px;
  height: 16px;
  margin: auto 4px;
}

.text::after {
  content: "";
  display: block;
  position: absolute;
  width: 0;
  height: 2px;
  border-radius: 1px;
  transition: width ease 150ms;
  background-color: var(--color-accent);
  bottom: -2px;
  left: 0;
}

.text:not(.is-last):hover {
  color: var(--color-accent);
  transform: translateY(-4px);
}

.text:not(.is-last):hover::after {
  width: 100%;
}
</style>