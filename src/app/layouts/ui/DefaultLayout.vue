<script setup lang="ts">
import ArrowBackIcon from '@material-design-icons/svg/filled/arrow_back.svg?component';
import { TransitionFade } from '@morev/vue-transitions';
import { ArticleAppearanceButton } from 'src/modules/book';
import { routerModel } from 'src/modules/router';
import { SelectThemeButton } from 'src/modules/theme';
</script>

<template>
  <div class="tw-h-full tw-flex tw-flex-1 tw-flex-col tw-pb-[var(--safe-area-inset-bottom)]">
    <div class="tw-pt-[calc(0.5rem_+_var(--safe-area-inset-top))] tw-pb-2 tw-px-4 tw-flex tw-justify-between tw-items-center tw-select-none tw-sticky tw-top-0 tw-z-10 blur tw-border-b tw-border-[var(--outline)]">
      <div class="tw-flex tw-items-center">
        <Transition name="collapse">
          <div
            v-if="$route.name !== routerModel.RouteName.Main"
            class="circle ripple tw-h-10 tw-w-10 tw-mr-2 tw-flex tw-justify-center tw-items-center tw-overflow-hidden tw-cursor-pointer"
            @click="$router.back()"
          >
            <i><ArrowBackIcon /></i>
          </div>
        </Transition>

        <div class="tw-text-2xl tw-font-extrabold tw-italic">
          {{ $t('title') }}
        </div>
      </div>

      <div class="tw-flex tw-gap-2">
        <TransitionFade
          mode="out-in"
          :duration="200"
        >
          <ArticleAppearanceButton v-if="$route.name === routerModel.RouteName.Article" />
        </TransitionFade>
        <SelectThemeButton class="tw-m-0" />
      </div>
    </div>

    <div class="tw-flex tw-flex-col tw-flex-1 tw-px-6 tw-py-4">
      <RouterView v-slot="{ Component }">
        <Component :is="Component" />
      </RouterView>
    </div>
  </div>
</template>

<style>
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.2s ease;
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  transform: translateX(-8px) scale(0.5);
  width: 0px !important;
  height: 0px !important;
  margin-right: 0px !important;
}
</style>
