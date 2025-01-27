import { App as CapacitorApp } from '@capacitor/app';
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

import './index.css';
import '@morev/vue-transitions/styles';
import 'beercss';
import 'material-dynamic-colors';

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
