import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginPage, LoginService } from '@app/login';
import { SharedModule } from '@shared/shared.module';
import { IonicModule } from 'ionic-angular';

@NgModule({
    imports: [
        IonicModule,
        SharedModule,
        FormsModule
    ],
    declarations: [
        // Pages list
        LoginPage

        // Components
    ],
    entryComponents : [
        // Pages list
        LoginPage

        // Components
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    providers: [
        LoginService
    ]
})
export class LoginModule { }
