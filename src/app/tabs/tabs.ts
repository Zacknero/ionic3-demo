import {Component, ViewChild} from '@angular/core';
import {Tab, Tabs} from 'ionic-angular';
import {AutoUnsubscribe} from '@core/auto-unsubscribe';

import {HomeTab} from '@app/home-tab';
import {DeviceService} from '@core/device';
import {SplitViewService} from '@core/split-view';
import {TabsService} from './tabs.service';
import {NewsTab} from "@app/news-tab";

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage extends AutoUnsubscribe {
    @ViewChild('appTabs') appTabs: Tabs;
    tab1Root = HomeTab;
    tab2Root = NewsTab;
    // tab3Root = InfoCornerTab;
    // tab4Root = NotificationsTab;
    splitViewIsActive: boolean = false;
    pushCounterBadge: number = 0;

    constructor(
        private splitViewService: SplitViewService,
        private deviceService: DeviceService,
        private tabsService: TabsService
    ) {
        super();
    }

    ionViewDidLoad(){
        this.initSplitViewSubscriptions();
    }


    private initSplitViewSubscriptions(){
        const Tabs = this;
        // If device is tablet activate split view and unlock orientation
        if(this.deviceService.isTablet()){
            this.splitViewIsActive = true;
            this.splitViewService.isOn$
                .takeUntil(this.destroy$)
                .subscribe((isActive: boolean) => {
                    Tabs.splitViewIsActive = isActive;
                });
            this.splitViewService.activateSplitView();
        }
        // Otherwise deactivate split view and lock orientation in portrait
        else {
            this.splitViewIsActive = false;
            this.splitViewService.deactivateSplitView();
        }
    }


    onTabChanges(activeTab: Tab){
        this.tabsService.onTabChanges$.next(activeTab.index);
    }

}
