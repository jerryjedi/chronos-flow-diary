
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4dac47bd00b347d6831ff46550c98f6e',
  appName: 'chronos-flow-diary',
  webDir: 'dist',
  server: {
    url: 'https://4dac47bd-00b3-47d6-831f-f46550c98f6e.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      releaseType: 'debug'
    }
  }
};

export default config;
