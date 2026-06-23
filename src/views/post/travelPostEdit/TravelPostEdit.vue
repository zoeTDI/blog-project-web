<script setup lang="ts">
  import { CaCard } from '@/components/ca/caCard';
  import {
    MapContainer,
    type MarkedCityGroup,
  } from '@/components/mapComponent';
  import { CaCascader } from '@/components/ca/caCascader';
  import { computed, ref } from 'vue';
  import { CaButton } from '@/components/ca/caButton';
  import { MarkdownRender } from '@/components/markdownRender';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const fromCity = ref<number[]>([]);
  const toCity = ref<number[]>([]);
  const toPinnedGroup = computed<MarkedCityGroup[]>(() => {
    const group: MarkedCityGroup = { id: 0, nodes: {} };
    if (fromCity.value.length > 0) {
      const fromCityAdcode = fromCity.value[fromCity.value.length - 1];
      group.nodes[fromCityAdcode] = [];
      if (toCity.value.length > 0) {
        const toCityAdcode = toCity.value[toCity.value.length - 1];
        group.nodes[fromCityAdcode].push(toCityAdcode);
      }
    }
    return [group];
  });
  const noteTitle = ref<string>('');
  const noteText = ref<string>('');
  const noteStatus = ref<'code' | 'preview'>('code');
</script>

<template>
  <ca-card class="travel-post-edit">
    <div class="container">
      <section class="map">
        <map-container
          v-model="fromCity"
          :marked-city-groups="toPinnedGroup">
          <template #info-panel="{ hoveredCity }">
            {{ hoveredCity?.name || t('travelPost.unknownRegion') }}
          </template>
        </map-container>
      </section>
      <section class="note-edit">
        <section class="city">
          <div class="from">
            <span class="label">{{ t('travelPost.fromCity') }}</span>
            <ca-cascader
              type="city"
              v-model="fromCity" />
          </div>
          <div class="to">
            <span class="label">{{ t('travelPost.toCity') }}</span>
            <ca-cascader
              type="city"
              v-model="toCity" />
          </div>
        </section>
        <section class="note-title">
          <input
            class="note-title_input"
            type="text"
            :placeholder="t('travelPost.titlePlaceholder')"
            v-model="noteTitle" />
          <ca-button
            v-show="noteStatus === 'code'"
            type="primary"
            class="preview"
            @click="() => (noteStatus = 'preview')"
            >{{ t('travelPost.preview') }}</ca-button
          >
          <ca-button
            v-show="noteStatus === 'preview'"
            type="primary"
            class="preview"
            @click="() => (noteStatus = 'code')"
            >{{ t('travelPost.sourceCode') }}</ca-button
          >
        </section>
        <section class="context">
          <textarea
            class="context_textarea"
            v-show="noteStatus === 'code'"
            v-model="noteText"
            :placeholder="t('travelPost.contentPlaceholder')" />
          <markdown-render
            class="preview"
            v-show="noteStatus === 'preview'"
            :content="noteText" />
        </section>
      </section>
    </div>
  </ca-card>
</template>

<style scoped>
  .container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 20px;
  }

  .map {
    aspect-ratio: 1/1;
  }

  .note-edit {
    display: flex;
    flex-direction: column;
    row-gap: 12px;
    border: 1px solid var(--color-border);
    padding: 10px;
  }

  .city {
    display: flex;
    justify-content: space-between;
    column-gap: 10px;
  }

  .from,
  .to {
    display: flex;
    align-items: center;
  }

  .from .label,
  .to .label {
    min-width: max-content;
  }

  .note-title {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .note-title_input {
    margin-right: auto;
    width: 80%;
    color: var(--color-text-primary);
    background-color: transparent;
    border: 1px solid transparent;
    font-size: 16px;
    border-bottom-color: var(--color-border);
  }

  .note-title_input:focus-visible {
    outline: 1px solid transparent;
  }

  .context {
    width: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .context_textarea {
    flex-grow: 1;
    width: 100%;
    font-size: 16px;
    color: var(--color-text-primary);
    background-color: transparent;
    resize: none;
  }

  .context_textarea:focus-visible {
    outline: 1px solid transparent;
  }

  .preview {
    border: 1px solid var(--color-border);
  }
</style>
