import { routerModel } from 'src/modules/router';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: routerModel.RouteName.Main,
      component: async () => (await import('src/pages/')).MainPage,
    },
    {
      path: '/books/:bookId',
      name: routerModel.RouteName.Book,
      component: async () => (await import('src/pages/')).BookPage,
    },
    {
      path: '/books/:bookId/:articleNumber',
      name: routerModel.RouteName.Article,
      component: async () => (await import('src/pages/')).ArticlePage,
    },
  ],
  scrollBehavior(to, _, savedPosition) {
    if (savedPosition && to.name !== routerModel.RouteName.Article) {
      return savedPosition;
    }
    return { top: 0, left: 0 };
  },
});

export default router;
