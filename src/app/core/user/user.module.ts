import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { LoggerService } from '@core/logger';
import { IonicStorageModule } from '@ionic/storage';

import { UserModuleConfig } from './models/UserModuleConfig';
import { UserService } from './user.service';

/**
* @name UserModule
* @description
* UserModule is an ngModule that imports a service to manage the logged or the guest user
*/
@NgModule({
    imports: [
        IonicStorageModule.forRoot(),
        HttpClientModule
    ],
    providers: [
        UserService,
        LoggerService
    ]
})
export class UserModule {
    constructor (@Optional() @SkipSelf() parentModule: UserModule) {
        if (parentModule) {
            throw new Error('UserModule is already loaded');
        }
    }


    /**
    * Allow to pass a <UserModuleConfig> configuration to services in UserModule
    * @param  {UserModuleConfig} config all available configuration for <UserModule>
    * @returns {ModuleWithProviders}
    */
    static forRoot(config: UserModuleConfig): ModuleWithProviders {
        return {
            ngModule: UserModule,
            providers: [
                { provide: UserModuleConfig, useValue: config }
            ]
        }
    }
}
