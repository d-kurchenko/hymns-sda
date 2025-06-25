import { App as CapacitorApp } from '@capacitor/app';
import { ui } from 'beercss';

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

const app = createApp(App);

app.use(router);

router.isReady().then(() => {
  app.mount('#app');
});

CapacitorApp.addListener('backButton', ({ canGoBack }) => {
  if (!canGoBack)
    CapacitorApp.exitApp();
  else
    window.history.back();
});
