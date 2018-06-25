import {NgModule} from '@angular/core';
import {SharedModule} from '@shared/shared.module';
import {IonicModule} from 'ionic-angular';

import {NewsTab} from "@app/news-tab/news-tab";
import {QuiPage} from "@app/news-tab/pages/qui/qui";
import {QuoPage} from "@app/news-tab/pages/quo/quo";
import {QuaPage} from "@app/news-tab/pages/qua/qua";

@NgModule({
    declarations: [
        // Tab with split view
        NewsTab,

        // Components


        // Pages list
        QuiPage,
        QuoPage,
        QuaPage
    ],
    imports: [
        IonicModule,
        SharedModule
    ],
    entryComponents: [
        // Tab with split view
        NewsTab,

        // Components


        // Pages list
        QuiPage,
        QuoPage,
        QuaPage
    ]
})
export class NewsModule {
}
