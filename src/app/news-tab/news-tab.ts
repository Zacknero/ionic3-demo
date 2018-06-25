import { Component, ViewChild } from '@angular/core';
import { PlaceholderPage, SplitViews, SplitViewService } from '@core/split-view';
import { Nav } from 'ionic-angular';

import {QuiPage} from "./pages/qui/qui";

@Component({
    selector: 'news-tab',
    templateUrl: 'news-tab.html'
})
export class NewsTab {
    // Grab References to our 2 NavControllers...
    @ViewChild('masterNav') masterNav: Nav;
    @ViewChild('detailNav') detailNav: Nav;

    constructor(
        private splitViewService: SplitViewService
    ) { }

    ionViewDidLoad(){
        this.splitViewService.initSplitView(
            SplitViews.AGENDA,
            {
                nav: this.masterNav,
                page: QuiPage
            },
            {
                nav: this.detailNav,
                page: PlaceholderPage,
                params : {
                    icon: 'star',
                    label: 'NEWS'
                }
            }
        );
    }
}
