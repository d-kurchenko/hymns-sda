import { App as CapacitorApp } from '@capacitor/app';

import { SafeArea } from '@capacitor-community/safe-area';
import { useThemeStore } from 'src/modules/theme/model';

import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import './index.css';
import '@morev/vue-transitions/styles';
import 'beercss';
import 'material-dynamic-colors';

const themeStore = useThemeStore();

SafeArea.enable({
  config: {
    customColorsForSystemBars: true,
    statusBarColor: '#00000000',
    navigationBarColor: '#00000000',
    statusBarContent: themeStore.activeColorMode.value === 'dark' ? 'light' : 'dark',
    navigationBarContent: themeStore.activeColorMode.value === 'dark' ? 'light' : 'dark',
  },
});

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
