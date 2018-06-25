import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { TranslateModule } from '@ngx-translate/core';

import { I18nService } from './i18n.service';
import { I18nModuleConfig } from './models/I18nModuleConfig';

/**
* @name I18nModule
* @description
* I18nModule is an ngModule that imports a service to manage the external JSON language file
* and initialize the ngx-translate library
*/
@NgModule({
    imports: [
        IonicStorageModule.forRoot(),
        TranslateModule.forRoot(),
        // TranslateModule.forRoot({
        //     loader: {
        //         provide: TranslateLoader,
        //         useClass: CustomTranslateHttpLoader,
        //         deps: [Injector]
        //     }
        // }),
        HttpClientModule
    ],
    providers: [
        I18nService
    ],
    exports : [
        TranslateModule
    ]
})
export class I18nModule {
    constructor (@Optional() @SkipSelf() parentModule: I18nModule) {
        if (parentModule) {
            throw new Error('I18nModule is already loaded');
        }
    }


    /**
    * Allow to pass a <I18nModuleConfig> configuration to services in I18nModule
    * @param  {I18nModuleConfig} config all available configuration for <I18nModule>
    * @returns {ModuleWithProviders}
    */
    static forRoot(config: I18nModuleConfig): ModuleWithProviders {
        return {
            ngModule: I18nModule,
            providers: [
                { provide: I18nModuleConfig, useValue: config }
            ]
        }
    }
}
