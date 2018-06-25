import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ApiModule } from '@core/api/api.module';
import { AuthInterceptor, AuthService, ErrorInterceptor } from '@core/auth';
import { LocalConfig } from '@core/config';
import { ConfigModule } from '@core/config/config.module';
import { DBModule } from '@core/db/db.module';
import { DeepLinkService } from '@core/deeplink';
import { DeviceModule } from '@core/device/device.module';
import { LoggerModule } from '@core/logger/logger.module';
import { NavigationModule } from '@core/navigation/navigation.module';
import { PushNotificationsModule } from '@core/push-notifications/push-notifications.module';
import { SplitViewModule } from '@core/split-view/split-view.module';
import { UserModule } from '@core/user/user.module';
import { ENV } from '@env';
import { InAppBrowser } from '@ionic-native/in-app-browser';

// import { CallNumber } from '@ionic-native/call-number';
// import { EmailComposer } from '@ionic-native/email-composer';
// import { File } from '@ionic-native/file';
// import { FileOpener } from '@ionic-native/file-opener';
// import { FileTransfer } from '@ionic-native/file-transfer';
// import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
    imports : [
        ConfigModule.forRoot({
            // remote: ENV.configUrl,
            local: LocalConfig,
            storePrefix: ENV.storePrefix
        }),
        ApiModule,
        DeviceModule.forRoot({
            modalTitle : ENV.appName,
            dialogsMode : 'native'
        }),
        LoggerModule,
        DBModule.forRoot({
            dbName: 'ionic_db'
        }),
        UserModule.forRoot({
            storePrefix: ENV.storePrefix
        }),
        NavigationModule,
        SplitViewModule,
        PushNotificationsModule
    ],
    providers: [
        AuthService,
        DeepLinkService,
        InAppBrowser,
        // EmailComposer,
        // FileTransfer,
        // File,
        // FileOpener,
        // CallNumber,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi : true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi : true }
    ]
})
export class CoreModule {

}
