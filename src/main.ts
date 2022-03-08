import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import {ConfigService} from './app/global/services/config.service';

if (environment.production) {
  enableProdMode();
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
(async function(){
  const [config, version] = await Promise.all([
    fetch('./config.json?v=' + Date.now()).then(data => data.json()),
    fetch('./version.json?v=' + Date.now()).then(data => data.json())
  ]);

  platformBrowserDynamic([{
    provide: ConfigService,
    useValue: ConfigService.getInstance(config, version)
  }]).bootstrapModule(AppModule)
    .catch(err => console.error(err));
})();

