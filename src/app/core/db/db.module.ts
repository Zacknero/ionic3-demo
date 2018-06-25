import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { DBService } from './db.service';
import { DBModuleConfig } from './models/DBModuleConfig';

/**
* @name DBModule
* @description
* DBModule is an ngModule that imports a service to manage local DB storage
*/
@NgModule({
    providers: [
        DBService
    ]
})
export class DBModule {
    constructor (@Optional() @SkipSelf() parentModule: DBModule) {
        if (parentModule) {
            throw new Error('DBModule is already loaded. Import it in the AppModule only');
        }
    }


    /**
    * Allow to pass a <DBModuleConfig> configuration to DBService
    * @param  {DBModuleConfig} config all available configuration for <DBModuleConfig>
    * @returns {ModuleWithProviders}
    */
    static forRoot(config?: Partial<DBModuleConfig>): ModuleWithProviders {
        return {
            ngModule: DBModule,
            providers: [
                { provide: DBModuleConfig, useValue: config }
            ]
        }
    }
}
