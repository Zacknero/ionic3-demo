import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { IonicPageModule } from 'ionic-angular';

import { PlaceholderPage } from './placeholder';

@NgModule({
    declarations: [
        PlaceholderPage
    ],
    imports: [
        IonicPageModule.forChild(PlaceholderPage),
        SharedModule
    ],
    exports: [
        PlaceholderPage
    ]
})
export class PlaceholderPageModule { }
