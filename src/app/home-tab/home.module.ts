import {NgModule} from '@angular/core';
import {SharedModule} from '@shared/shared.module';
import {IonicModule} from 'ionic-angular';

import {HomeTab} from './home-tab';
import {HomePage} from './pages/home/home';
import {Page1Page} from "@app/home-tab/pages/page1/page1";
import {Page2Page} from "@app/home-tab/pages/page2/page2";

@NgModule({
    declarations: [
        // Tab with split view
        HomeTab,
        Page1Page,
        Page2Page,

        // Components


        // Pages list
        HomePage
    ],
    imports: [
        IonicModule,
        SharedModule
    ],
    entryComponents: [
        // Tab with split view
        HomeTab,
        Page1Page,
        Page2Page,

        // Components


        // Pages list
        HomePage
    ]
})
export class HomeModule {
}
