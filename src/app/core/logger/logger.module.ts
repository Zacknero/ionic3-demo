import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { LoggerService } from './logger.service';
import { LoggerModuleConfig } from './models/LoggerModuleConfig';

/**
* @name LoggerModule
* @description
* LoggerModule is an ngModule that imports the loggerService to log in browser or Cordova device
* with programmable level of log
*/
@NgModule({
    providers: [
        LoggerService
    ]
})
export class LoggerModule {
    constructor (@Optional() @SkipSelf() parentModule: LoggerModule) {
        if (parentModule) {
            throw new Error('LoggerModule is already loaded. Import it in the AppModule only');
        }
    }


    /**
    * Allow to pass a <LoggerModuleConfig> configuration to LoggerService
    * @param  {LoggerServiceConfig} config all available configuration for <LoggerModuleConfig>
    * @returns {ModuleWithProviders}
    */
    static forRoot(config?: Partial<LoggerModuleConfig>): ModuleWithProviders {
        return {
            ngModule: LoggerModule,
            providers: [
                { provide: LoggerModuleConfig, useValue: config }
            ]
        }
    }
}
