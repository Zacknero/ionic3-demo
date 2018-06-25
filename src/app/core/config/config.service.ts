import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http/src/response';
import { Injectable } from '@angular/core';
import { DeviceService } from '@core/device';
import { LoggerService } from '@core/logger';
import { Storage } from '@ionic/storage';

import { ApiConfig } from './models/ApiConfig';
import { Config } from './models/Config';
import { ConfigModuleConfig } from './models/ConfigModuleConfig';
import { RequestMethods } from './models/RequestMethods';

const storageKeys = {
    lastConfig: 'last'
};

@Injectable()
export class ConfigService {
    private url: string;
    private config: Config | undefined;
    private storage: Storage;
    public initCompleted: Promise<any>;

    constructor(
        public configModule: ConfigModuleConfig,
        private http: HttpClient,
        private logger: LoggerService,
        private deviceService: DeviceService
    ) {
        this.storage = new Storage({
            name : configModule.storePrefix || 'storage',
            storeName: 'config',
            driverOrder : ['localstorage']
        });
        this.initCompleted = this.init(configModule);
    }


    /**
     * Returns the last config file stored in localStorage with last modified date
     * @returns {Promise<Config>}
     */
    private getLastConfig(): Promise<Config> {
        return this.storage.get(storageKeys.lastConfig)
    }


    /**
     * Download config file and init the app
     */
    private init(configModule: ConfigModuleConfig) {
        return new Promise<any>((resolve, reject) => {
            // If requested config is a remote one => download it
            if(configModule.remote){
                this.url = configModule.remote;
                this.download().then(
                    (config: Config) => {
                        this.initConfig(config);
                        resolve();
                    },
                    reject
                );
            }
            // Otherwise use the local one (if exists)
            else if(configModule.local){
                this.initConfig(configModule.local);
                resolve();
            }
            else {
                reject(new Error('NO_CONFIG_DEFINED'));
            }
        });
    }

    private initConfig(config: Config) {
        this.config = new Config(config);
        this.logger.changeLevel(this.config.loggerLevel);
        this.storage.set(storageKeys.lastConfig, config);
    }


    /**
     * Download the external config file and store it in localStorage
     * @returns {Promise<Config>}
     */
    private download(): Promise<Config> {
        return new Promise<any>((resolve, reject) => {
            this.getLastConfig().then(
                lastConfig => {
                    if(this.deviceService.isOnline()){
                        // Try to download the new config file only if it was modified
                        let headers = new HttpHeaders().set('Content-Type', 'application/json');
                        if(lastConfig && lastConfig.lastModified){
                            //headers = headers.set('If-Modified-Since', lastConfig.lastModified);
                        }
                        this.http.get<Config>(`${this.url}?t=${new Date().getTime()}`, {headers, observe: 'response'}).subscribe(
                            (res: HttpResponse<Config>) => {
                                // If config.json was updated initialize it and update the lastModified property
                                (<Config>res.body).lastModified = <string>res.headers.get('Last-Modified');
                                resolve(res.body);
                            },
                            (err: HttpErrorResponse) => {
                                // If the HTTP call fails but I have a local config
                                // initialize it with localStorage version
                                if(lastConfig){
                                    resolve(lastConfig);
                                }
                                // The download fails and a local config doesn't exists, so throw an error
                                else {
                                    console.error(err);
                                    reject(new Error('ERR_APP_MISSING_CONFIG_FILE'));
                                }
                            });
                    }
                    // If the device is offline but I have a local config
                    // initialize it with localStorage version
                    else {
                        if(lastConfig){
                            resolve(lastConfig);
                        }
                        // The download fails and a local config doesn't exists, so throw an error
                        else {
                            reject(new Error('DEVICE_OFFLINE'));
                        }
                    }
                }
            );
        });
    }


    /**
     * Get api configuration from the config.json file
     * @param apiName string Attribute name of requested api
     * @returns {ApiConfig|null}
     */
    getApiConfig(apiName:string): ApiConfig|null {
        return (<Config>this.config).backend.getApiConfig(apiName);
    }


    /**
     * Get api configuration from the config.json file
     * @param url string HTTP request's url
     * @param method string HTTP request's method
     * @returns {ApiConfig|null}
     */
    createNewApiConfig(url: string, method: string = RequestMethods.GET): ApiConfig {
        return (<Config>this.config).backend.createNewApiConfig(url, method);
    }


    getExternalUrls() {
        return (<Config>this.config).externalUrls;
    }
}
