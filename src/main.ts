import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { config } from './config/config';
import { AppModule } from './app/app.module';

if (config.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
