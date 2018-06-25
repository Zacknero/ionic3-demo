import { Component, ViewChild } from '@angular/core';
import { PlaceholderPage, SplitViews, SplitViewService } from '@core/split-view';
import { Nav } from 'ionic-angular';

import { HomePage } from './pages/home/home';

@Component({
    selector: 'home-tab',
    templateUrl: 'home-tab.html'
})
export class HomeTab {
    // Grab References to our 2 NavControllers...
    @ViewChild('masterNav') masterNav: Nav;
    @ViewChild('detailNav') detailNav: Nav;

    constructor(
        private splitViewService: SplitViewService
    ) { }

    ionViewDidLoad(){
        this.splitViewService.initSplitView(
            SplitViews.NOTIFICATIONS,
            {
                nav: this.masterNav,
                page: HomePage
            },
            {
                nav: this.detailNav,
                page: PlaceholderPage,
                params : {
                    icon: 'home',
                    label: 'HOME_PLACEHOLDER'
                }
            }
        );
    }
}
