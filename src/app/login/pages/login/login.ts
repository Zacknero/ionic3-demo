import { Component } from '@angular/core';
import { TabsService } from '@app/tabs';
import { ConfigService } from '@core/config';
import { DeviceService } from '@core/device';
import { LoggerService } from '@core/logger';
import { UserService } from '@core/user';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ViewController } from 'ionic-angular';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    username: string = '';
    password: string = '';

    constructor(
        private logger: LoggerService,
        private userService: UserService,
        private deviceService: DeviceService,
        private tabsService: TabsService,
        private viewCtrl: ViewController,
        private inAppBrowser: InAppBrowser,
        private configService: ConfigService
    ) { }


    onLoginSubmit() {
        this.logger.debug(`credentials ${this.username}/${this.password}`);
        this.deviceService.showLoading();
        this.userService.login(this.username, this.password).then(
            () => {
                this.userService.setFirstAccess();
                this.tabsService.loadTabsPage();
                this.closeModal();
            },
            (err: Error) => {
                this.deviceService.alert(err.message);
            }
        );
    }


    onForgotPasswordClicked() {
        this.inAppBrowser.create(this.configService.getExternalUrls().forgotPassword, '_system');
    }

    /**
     * Close login modal
     */
    closeModal() {
        this.viewCtrl.dismiss();
    }

}
