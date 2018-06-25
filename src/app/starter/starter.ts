import { Component } from '@angular/core';
import { LoginService } from '@app/login';
import { TabsService } from '@app/tabs';
import { ConfigService } from '@core/config';
import { DeepLinkService } from '@core/deeplink';
import { DeviceService } from '@core/device';
import { LoggerService } from '@core/logger';
import { PushNotificationsService } from '@core/push-notifications';
import { UserService } from '@core/user';
import { I18nService } from '@shared/i18n';

@Component({
    selector: 'app-starter',
    templateUrl: 'starter.html'
})
export class Starter {
    public status: string | null;
    private deepLinkLogin: string|null = null;
    private appIsAlreadyLoaded: boolean = false;

    constructor(
        private tabsService: TabsService,
        private configService: ConfigService,
        private deviceService: DeviceService,
        private i18nService: I18nService,
        private logger: LoggerService,
        private userService: UserService,
        private loginService: LoginService,
        private deepLinkService: DeepLinkService,

        // tslint:disable-next-line
        private pushNotificationsService: PushNotificationsService
    ) {
        this.deepLinkService.onDeepLinking$
            .subscribe((eventCode: string) => {
            // If the app is already loaded directly process the new event code
            if(this.appIsAlreadyLoaded){
                console.log('goto deeplink');
            }
            // Otherwise save the new event code in order to use when the app was ready
            else {
                this.deepLinkLogin = eventCode;
            }
        });
    }

    ionViewDidEnter(){
        this.status = null;

        // Wait for config and translations configurations completed
        let servicesToWait = [
            this.configService.initCompleted,
            this.i18nService.initCompleted
        ];
        // If the app can make an autologin also wait for
        // push notification complete because after login the app calls the API
        if(!this.userService.isFirstAccess()){
            servicesToWait.push(this.pushNotificationsService.initCompleted);
        }

        Promise.all(servicesToWait).then(
            () => {
                this.logger.debug('initialize completed');
                // Try autologin
                this.userService.autologin().then(
                    () => {
                        this.appIsAlreadyLoaded = true;
                        // If user autologs successfully go to TabsPage
                        // if no event code deeplink exists was arrived
                        if(this.deepLinkLogin){
                            // this.userService.onNewEventCodeArrived(this.deepLinkEventCode).then(
                            //     () => {
                            //         // After login go to tabs page
                            //         this.userService.setFirstAccess();
                                    this.loadTabsPage();
                            //     },
                            //     (err: Error) => {
                            //         // If the login fails go to tabs page (back to public access)
                            //         this.loadTabsPage();
                            //         this.deviceService.alert(err.message);
                            //     }
                            // );
                            // this.deepLinkLogin = null;
                        }
                        else {
                            this.loadTabsPage();
                        }
                    },
                    () => {
                        this.appIsAlreadyLoaded = true;
                        // Otherwise check if new event code deeplink was arrived
                        if(this.deepLinkLogin){
                            // this.userService.onNewEventCodeArrived(this.deepLinkLogin).then(
                            //     () => {
                            //         // After login go to tabs page
                            //         this.userService.setFirstAccess();
                                    this.loadTabsPage();
                            //     },
                            //     (err: Error) => {
                            //         // If the login fails login main login view
                            //         this.loadMainLogin();
                            //         this.deviceService.alert(err.message);
                            //     }
                            // );
                            this.deepLinkLogin = null;
                        }
                        // else open the login modal using the loginService
                        else {
                            // this.loadMainLogin();
                            this.loadTabsPage();
                        }
                    }
                )
            },
            (err: Error) => {
                this.status = err.message;
                this.deviceService.hideSplashscreen();
            }
        )
    }


    /**
     * When agendaService is completed go to tabsPage if not already exists
     */
    private loadTabsPage(){
        this.tabsService.loadTabsPage();
    }


    /**
     * Show the main login view and close the splashscreen
     */
    private loadMainLogin(){
        this.loginService.openMainLogin();
        this.deviceService.hideSplashscreen();
    }
}
