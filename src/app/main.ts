import { App as CapacitorApp } from '@capacitor/app';

import { ui } from 'beercss';
import { initI18n } from 'src/i18n';
import { themeLib, themeModel } from 'src/modules/theme';
import { createApp } from 'vue';
import App from './App.vue';

import router from './router';

import '@morev/vue-transitions/styles';
import 'material-dynamic-colors';
import './index.css';

const { activeColorMode } = themeModel.useThemeStore();
themeLib.syncSafeAreaContentColor(activeColorMode.value);

ui('theme', '#44d8f1');

CapacitorApp.addListener('backButton', ({ canGoBack }) => {
  if (!canGoBack)
    CapacitorApp.exitApp();
  else
    window.history.back();
});

(async () => {
  const app = createApp(App);
  const i18n = await initI18n();

  app.use(i18n);
  app.use(router);

  await router.isReady();
  app.mount('#app');
})();
