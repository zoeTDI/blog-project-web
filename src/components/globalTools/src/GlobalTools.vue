<script setup lang="ts">
import { 
  SunIcon, MoonIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon,
  GlobeAltIcon, LanguageIcon 
} from '@heroicons/vue/24/outline';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { ToolType, ToolShape } from './types';
import { preferenceManager, preferences, SUPPORT_LANGUAGE_OPTIONS, TIMEZONE_OPTIONS } from '@/core/preferences';
import {MenuPopover} from '@/components/globalTools';


interface Props {
  include?: ToolType[];
  shape?: ToolShape;
}

const props = withDefaults(defineProps<Props>(), { shape: 'rounded' });

const curThemeMode = computed(() => preferences.theme.mode);
const isFullScreen = ref(!!document.fullscreenElement);

const updateFullscreenState = () => { isFullScreen.value = !!document.fullscreenElement; };
const toggleTheme = () => preferenceManager.updatePreferences({theme: {mode: curThemeMode.value === 'light' ? 'dark' : 'light'}});

const toggleFullscreen = () => {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
};

onMounted(() => document.addEventListener('fullscreenchange', updateFullscreenState));
onUnmounted(() => document.removeEventListener('fullscreenchange', updateFullscreenState));

const activeMenu = ref<string | null>(null);

const timezones = Object.values(TIMEZONE_OPTIONS).map((option: string) => ({label: option, value: option}))
const languages = Object.values(SUPPORT_LANGUAGE_OPTIONS).map((option: string) => ({label: option, value: option}))

const shouldShow = (tool: ToolType) => !props.include || props.include.includes(tool);

const toggleMenu = (menu: string, event: MouseEvent) => {
  event.stopPropagation();
  activeMenu.value = (activeMenu.value === menu) ? null : menu;
};

const handleSelect = (type: 'timezone' | 'language', value: any) => {
  activeMenu.value = null;
};
</script>

<template>
  <div class="global-tools">
    <button v-if="shouldShow('theme')" :class="['tool-btn', shape]" @click="toggleTheme" title="切换主题">
      <SunIcon v-show="curThemeMode === 'light'" class="icon" />
      <MoonIcon v-show="curThemeMode === 'dark'" class="icon" />
    </button>

    <button v-if="shouldShow('fullscreen')" :class="['tool-btn', shape]" @click="toggleFullscreen" title="全屏">
      <ArrowsPointingOutIcon v-show="!isFullScreen" class="icon" />
      <ArrowsPointingInIcon v-show="isFullScreen" class="icon" />
    </button>

    <div v-if="shouldShow('timezone')" class="tool-wrapper">
      <button :class="['tool-btn', shape]" @click="toggleMenu('timezone', $event)" title="切换时区">
        <GlobeAltIcon class="icon" />
      </button>
      <MenuPopover 
        :modelValue="activeMenu === 'timezone'" 
        @update:modelValue="activeMenu = null"
        :options="timezones" 
        @select="(val) => handleSelect('timezone', val)" 
      />
    </div>

    <div v-if="shouldShow('language')" class="tool-wrapper">
      <button :class="['tool-btn', shape]" @click="toggleMenu('language', $event)" title="切换语言">
        <LanguageIcon class="icon" />
      </button>
      <MenuPopover 
        :modelValue="activeMenu === 'language'" 
        @update:modelValue="activeMenu = null"
        :options="languages" 
        @select="(val) => handleSelect('language', val)" 
      />    
    </div>
  </div>
</template>

<style scoped>
.global-tools { display: flex; align-items: center; gap: 8px; }
.tool-wrapper { position: relative; }
.tool-btn {
  width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
  padding: 8px; background: transparent; border: none; cursor: pointer;
  color: #666; transition: all 0.2s ease;
}
.tool-btn:hover { background-color: #f0f0f0; color: #333; }
.tool-btn.rounded { border-radius: 6px; }
.tool-btn.circle { border-radius: 50%; }
.icon { width: 100%; flex-shrink: 0; }
</style>