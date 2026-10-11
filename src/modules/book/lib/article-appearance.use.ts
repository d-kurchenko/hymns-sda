import { createSharedComposable } from '@vueuse/core';
import { settingsModel } from 'src/modules/settings';

export const useArticleAppearance = createSharedComposable(() => {
  const fontSize = settingsModel.useSettings().setting('fontSize');

  return {
    fontSize,
  };
});
