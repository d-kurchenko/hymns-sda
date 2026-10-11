import { routerModel } from 'src/modules/router';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // Pages own their scroll containers. Also tells Vue Router to turn off
  // native history restoration, which would otherwise compete on Back.
  scrollBehavior: () => false,
  routes: [
    {
      path: '/',
      name: routerModel.RouteName.Main,
      component: async () => (await import('src/pages/')).MainPage,
    },
    {
      path: '/favorites',
      name: routerModel.RouteName.Favorites,
      component: async () => (await import('src/pages/')).FavoritesPage,
    },
    {
      path: '/info',
      name: routerModel.RouteName.Info,
      component: async () => (await import('src/pages/')).InfoPage,
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
});

router.afterEach((to, from) => {
  const toDepth = to.path.split('/').filter(Boolean).length;
  const fromDepth = from.path.split('/').filter(Boolean).length;
  to.meta.transition = toDepth <= 1 && fromDepth <= 1
    ? 'fade'
    : toDepth < fromDepth ? 'slide-right' : 'slide-left';
});

export default router;
