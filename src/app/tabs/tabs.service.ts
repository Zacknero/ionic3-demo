import { Injectable } from '@angular/core';
import { DeviceService } from '@core/device';
import { App } from 'ionic-angular';
import { Subject } from 'rxjs';

// import { TabsPage } from '@app/tabs/tabs';
declare var require: any;

@Injectable()
export class TabsService {
    public tabsIsLoded: boolean = false;
    public onTabChanges$: Subject<number> = new Subject<number>();

    constructor(
        private appCtrl: App,
        private deviceService: DeviceService
    ){ }

    isTabsLoaded(): boolean {
        let tabsIsLoaded = true;
        try{
            // Check if the TabsPage is already loaded
            let view = this.appCtrl.getRootNavs()[0].getViews()[0];
            // If the TabsPage doesn't exists go to TabsPage for the first time
            if(!view || view.name !== 'TabsPage'){
                tabsIsLoaded = false;
            }
        }catch(e){
            tabsIsLoaded = false;
        }
        return tabsIsLoaded;
    }

    /**
     * Load the TabsPage for the first time
     */
    loadTabsPage(){
        if(!this.tabsIsLoded){
            const { TabsPage } = require('./tabs'); // <-- Workaround to avoid dependency loop
            this.appCtrl.getRootNavs()[0].setRoot(TabsPage, {}, {}, () => {
                this.tabsIsLoded = true;
            });
        }
        setTimeout(() => {
            this.deviceService.hideSplashscreen();
            this.deviceService.hideLoading();
        }, 500);
    }
}
