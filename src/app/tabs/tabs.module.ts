import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { IonicModule } from 'ionic-angular';

import { TabsPage } from './tabs';
import { TabsService } from './tabs.service';

@NgModule({
    declarations: [
        TabsPage
    ],
    imports: [
        IonicModule,
        SharedModule
    ],
    entryComponents : [
        TabsPage
    ],
    providers: [
        TabsService
    ]
})
export class TabsModule { }
