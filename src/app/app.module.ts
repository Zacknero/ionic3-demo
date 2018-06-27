import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { App } from '@app/app.component';
import { HomeModule } from '@app/home-tab';
import { IonicConfig } from '@app/ionic.config';
import { LoginModule } from '@app/login/login.module';
import { Starter } from '@app/starter/starter';
import { TabsModule } from '@app/tabs/tabs.module';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import {NewsModule} from "@app/news-tab";

import 'chartjs-plugin-zoom';

@NgModule({
    declarations: [
        App,
        Starter
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(App, IonicConfig),
        CoreModule,
        SharedModule,
        LoginModule,
        TabsModule,
        HomeModule,
        NewsModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        App,
        Starter
    ],
    providers: [
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {}
