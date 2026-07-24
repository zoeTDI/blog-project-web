<script setup lang="ts">
  import type { CaCardFooterAction, CaCardProps } from './types.ts';
  import type { ComponentSize } from '#/component.ts';
  import { computed, onUnmounted, ref, useSlots, watch } from 'vue';
  import { isArray, isNumber } from '@caldm/utils';
  import { useCSSNamespace, useDebounceFn } from '@caldm/hook';
  import CaButton from '../../button/src/Button.vue';

  defineOptions({
    name: 'CaCard',
  });

  const props = withDefaults(defineProps<CaCardProps>(), {
    headerMaxHeight: 'S',
    footerMaxHeight: 'S',
    footerActions: () => [],
  });

  const slots = useSlots();
  const ns = useCSSNamespace('card');

  const shouldShowHeader = computed(() => !!slots.header);
  const shouldShowFooter = computed(
    () => !!slots.footer || (isArray(props.footerActions) && props.footerActions.length > 0),
  );
  const enhancedActions = ref<CaCardFooterAction[]>([]);
  const cleanupActions = () => {
    enhancedActions.value.forEach((action) => {
      if (action.run && 'cancel' in action.run) {
        action.run.cancel();
      }
    });
  };

  const sizeMap: Record<ComponentSize, number> = {
    S: 60,
    M: 120,
    L: 200,
  };

  function isComponentSize(size: string): size is ComponentSize {
    return ['S', 'M', 'L'].includes(size);
  }

  const classes = computed(() => {
    const cls: string[] = [ns.b()];
    return cls;
  });

  const headerStyle = computed(() => {
    const headerHeightKey: string = ns.cssVarBlockName('header-max-height');
    if (isNumber(props.headerMaxHeight)) return { [headerHeightKey]: `${props.headerMaxHeight}px` };
    if (isComponentSize(props.headerMaxHeight)) {
      return {
        [headerHeightKey]: `${sizeMap[props.headerMaxHeight]}px`,
      };
    }
    return {};
  });
  const footerStyle = computed(() => {
    const footerHeightKey: string = ns.cssVarBlockName('footer-max-height');
    if (isNumber(props.footerMaxHeight)) return { [footerHeightKey]: `${props.footerMaxHeight}px` };
    if (isComponentSize(props.footerMaxHeight)) {
      return {
        [footerHeightKey]: `${sizeMap[props.footerMaxHeight]}px`,
      };
    }
    return {};
  });

  watch(
    () => props.footerActions,
    (newActions) => {
      cleanupActions();
      enhancedActions.value = (newActions || []).map((action) => {
        if (
          action.timeout &&
          action.timeout > 0 &&
          typeof action.onClick === 'function'
        ) {
          return {
            ...action,
            run: useDebounceFn(action.onClick, action.timeout),
          };
        }
        return {
          ...action,
          run: action.onClick,
        };
      });
    },
    { immediate: true }
  );

  onUnmounted(() => {
    enhancedActions.value.forEach((action) => {
      if (action.run && 'cancel' in action.run) {
        (action.run as any).cancel();
      }
    });
  });
</script>

<template>
  <div :class="classes">
    <header :class="ns.e('header')"
            v-if="shouldShowHeader"
            :style="headerStyle">
      <div :class="ns.s('wrapper')">
        <slot name="header" />
      </div>
    </header>

    <main :class="ns.e('body')">
      <slot />
    </main>

    <footer :class="ns.e('footer')"
            v-if="shouldShowFooter"
            :style="footerStyle">
      <div :class="ns.s('wrapper')"
           v-if="!!slots.footer">
        <slot name="footer" />
      </div>
      <div v-if="isArray(props.footerActions) && props.footerActions.length > 0"
           :class="ns.e('action')">
        <CaButton v-for="action in enhancedActions"
                  :key="action.key"
                  :type="action.type || 'primary'"
                  @click="action.run?.()">
          {{ action.label }}
        </CaButton>
      </div>
    </footer>
  </div>
</template>

<style scoped>
  .ca-card {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    height: 100%;
    padding: var(--content-padding-M);
    background-color: var(--color-container-bg);
    border: 2px dashed var(--color-border);
  }

  .ca-card__body {
    flex: 1;
    overflow-y: auto;
  }

  .ca-card__header,
  .ca-card__footer {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
  }

  .ca-card-wrapper {
    overflow-y: auto;
    flex: 1;
  }

  .ca-card__header {
    --header-max-height: 60px;
    max-height: var(--ca-card-header-max-height);
    border-bottom: 1px dashed var(--color-border);
  }

  .ca-card__footer {
    --footer-max-height: 60px;
    max-height: var(--ca-card-footer-max-height);
    border-top: 1px solid var(--color-border);
  }

  .ca-card__action {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 12px;
    padding: 8px 0;
  }
</style>