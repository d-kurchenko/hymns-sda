import { createSharedComposable, useLocalStorage } from '@vueuse/core';
import { bookModel } from '..';

export const useArticleAppearance = createSharedComposable(() => {
  const fontSize = useLocalStorage('article:font-size', bookModel.DEFAULT_FONT_SIZE);

  return {
    fontSize,
  };
});
