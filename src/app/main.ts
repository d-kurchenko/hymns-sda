import { App as CapacitorApp } from '@capacitor/app';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';
import router from './router';

import './index.css';

const app = createApp(App);

app.use(createPinia());
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
