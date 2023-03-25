/**
 * Title: main.ts
 * Author: Richard Krasso
 * Contributor: Walter McCue
 * Date: 03/19/23
 * Description: main.ts for the nodebucket project
*/

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
