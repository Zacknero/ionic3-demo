import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ENV } from '@env';

import { AppModule } from './app.module';


if(ENV.productionMode){
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
