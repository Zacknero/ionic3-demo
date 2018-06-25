import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { PlaceholderPageModule } from './placeholder/placeholder.module';
import { SplitViewService } from './split-view.service';

@NgModule({
    imports: [
        IonicModule,
        PlaceholderPageModule
    ],
    providers : [
        SplitViewService
    ]
})
export class SplitViewModule { }
