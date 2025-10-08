import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.recetas.app',
  appName: 'RecetasApp',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,      // Duración (ms)
      launchAutoHide: true,          // Se cierra automáticamente
      backgroundColor: '#6A1B9A',    // Color de fondo morado
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,            // Sin spinner
    },
  },
};

export default config;
