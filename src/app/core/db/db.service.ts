import { Injectable } from '@angular/core';
import { DeviceService } from '@core/device';
import LokiJS, { Collection } from 'lokijs';

import { DBModuleConfig } from './models/DBModuleConfig';
import { LokiConfigOptions } from './models/LokiConfigOptions';

declare var require: any;
var LokiCordovaFSAdapter = require('loki-cordova-fs-adapter');
var LokiIndexedAdapter = require('lokijs/src/loki-indexed-adapter');

@Injectable()
export class DBService {
    private dbName: string;
    private db: LokiJS;
    public initCompleted: Promise<any>;

    constructor(
        public dbModuleConfig: DBModuleConfig,
        private deviceService: DeviceService
    ) {
        const DB = this;
        DB.dbName = dbModuleConfig.dbName;
        this.initCompleted = new Promise((resolve, reject) => {
            if (this.deviceService.isCordova()) {
                document.addEventListener('deviceready', () => {
                    DB.initLokiDB().then(resolve, reject);
                }, true);
            }
            else {
                DB.initLokiDB().then(resolve, reject);
            }
        });
    }


    /**
     * Create new LokiJS db
     * If the app runs on browser it persists data on localStorage
     * while in a real device it persists data on file system,
     * using the LokiCordovaFSAdapter and the cordova-plugin-file
     * @param  {string} dbName
     * @param  {Partial<LokiConfigOptions>} lokiOptions?
     */
    createLokiDB(dbName:string, lokiOptions?: Partial<LokiConfigOptions>): LokiJS {

        lokiOptions = new LokiConfigOptions(lokiOptions);

        if(this.deviceService.isCordova()){
            lokiOptions.env = 'CORDOVA';
            if (!lokiOptions.adapter) {
                lokiOptions.adapter = new LokiCordovaFSAdapter({ 'prefix' : dbName });
            }
        }
        else {
            if (!lokiOptions.adapter) {
                lokiOptions.adapter = new LokiIndexedAdapter(dbName);
            }
            lokiOptions.env = 'BROWSER';
            lokiOptions.persistenceMethod = 'localStorage';
        }

        return new LokiJS(dbName, lokiOptions);
    }


    /**
     * Get the collection from its name,
     * or, if not exists, create it and returns
     * @param  {string} name
     */
    getOrCreateCollection(name: string): Collection{
        // Init the allMeeting collection
        let newCollection = this.db.getCollection(name);
        if (newCollection === null) {
            newCollection = this.db.addCollection(name);
        }
        return newCollection;
    }


    /**
     * Create and load the LokiJS database
     * @returns Promise
     */
    initLokiDB(lokiOptions?: Partial<LokiConfigOptions>): Promise<LokiJS>{
        return new Promise((resolve, reject) => {

            // Create a LokiJS DB
            // this.db = this.createLokiDB(this.dbName, {
            //     autosave: true,
            //     autosaveInterval: 1000,
            //     autoload: false,
            //     verbose: true
            // });
            this.db = this.createLokiDB(this.dbName, lokiOptions);

            // Define options for LokiDB load
            let options = {};

            // Load database
            this.db.loadDatabase(options, (data: any) => {
                if(data instanceof Error){
                    reject(data);
                }
                else {
                    resolve(this.db);
                }
            });
        });
    }


    getDB(): LokiJS{
        return this.db;
    }
}
