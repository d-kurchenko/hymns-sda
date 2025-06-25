<script setup lang="ts">
import ArrowBackIcon from '@material-design-icons/svg/filled/arrow_back.svg?component';
import { ArticleAppearanceButton } from 'src/modules/book';
import { routerModel } from 'src/modules/router';
import { SelectThemeButton } from 'src/modules/theme';
</script>

<template>
  <div class="tw-h-full tw-flex tw-flex-1 tw-flex-col tw-pb-[var(--safe-area-inset-bottom)]">
    <div class="tw-pt-[calc(0.5rem_+_var(--safe-area-inset-top))] tw-pb-2 tw-px-4 tw-flex tw-justify-between tw-items-center tw-select-none tw-sticky tw-top-0 tw-z-10 blur tw-border-b tw-border-[var(--outline)]">
      <div class="tw-flex tw-items-center">
        <button
          v-if="$router.options.history.state.back"
          class="transparent circle ripple"
          @click="$router.back()"
        >
          <i><ArrowBackIcon /></i>
        </button>

        <div class="tw-text-2xl tw-font-extrabold tw-italic tw-ms-2">
          Гимны АСД
        </div>
      </div>

      <div class="tw-flex tw-gap-2">
        <ArticleAppearanceButton v-if="$route.name === routerModel.RouteName.Article" />
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
