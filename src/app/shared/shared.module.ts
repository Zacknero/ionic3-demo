import { NgModule } from '@angular/core';
import { EN } from '@app/shared/i18n/models/langs/EN';
import { LocalI18n } from '@app/shared/i18n/models/LocalI18n';
import { ENV } from '@env';
import { I18nModule } from '@shared/i18n/i18n.module';
import { ModalNavPageModule } from '@shared/modal-nav/modal-nav.module';
import { IonicModule } from 'ionic-angular';

@NgModule({
    imports : [
        IonicModule,
        ModalNavPageModule,
        I18nModule.forRoot({
            // remote: ENV.translationsUrl,
            local: {
                i18n: LocalI18n,
                langs: {
                    en: EN
                }
            },
            storePrefix: ENV.storePrefix
        })
    ],
    exports : [
        I18nModule,
        ModalNavPageModule
    ]
})
export class SharedModule { }
