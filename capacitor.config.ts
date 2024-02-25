import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sdahymns.app',
  appName: 'sda-hymns',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
