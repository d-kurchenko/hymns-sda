import type { CapacitorConfig } from '@capacitor/cli';
import '@capacitor-community/safe-area';

const config: CapacitorConfig = {
  appId: 'com.hymns.sda',
  webDir: 'dist',
  android: {
    backgroundColor: '#111415',
  },
  plugins: {
    SystemBars: {
      insetsHandling: 'disable',
    },
  },
};

export default config;
