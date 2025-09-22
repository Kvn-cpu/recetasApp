import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.recetas.app',   // 👈 debe coincidir con Firebase y build.gradle
  appName: 'recetasApp',
  webDir: 'www'
};

export default config;
