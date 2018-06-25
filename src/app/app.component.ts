import { Component } from '@angular/core';
import { Starter } from '@app/starter/starter';
import { AutoUnsubscribe } from '@core/auto-unsubscribe';
import { DeviceService } from '@core/device';
import { LoginStates, UserService } from '@core/user';
import { Platform } from 'ionic-angular';

@Component({
    templateUrl: 'app.html'
})
export class App extends AutoUnsubscribe {
    rootPage: any = Starter;
    userIsNotLogged: boolean = false;

    constructor(
        private platform: Platform,
        private deviceService: DeviceService,
        private userService: UserService
    ) {
        super();
        this.platform.ready().then(() => {
            this.initOrientation();
            this.initLogoutSubscriptions();
        });
    }


    /**
     * Initialize the native device orientation
     */
    initOrientation(){
        // If device is tablet activate split view and unlock orientation
        if(this.deviceService.isTablet()){
            if(this.deviceService.isCordova()){
                this.deviceService.unlockOrientation();
            }
        }
        // Otherwise deactivate split view and lock orientation in portrait
        else if(this.deviceService.isCordova()){
            this.deviceService.lockOrientation(this.deviceService.ORIENTATIONS.PORTRAIT_PRIMARY);
        }
    }


    /**
     * Initialize subscription for logout events in order to hide the app's content
     */
    initLogoutSubscriptions(){
        this.userService.onSessionChanges$
            .takeUntil(this.destroy$)
            .subscribe((loginState: number) => {
                this.userIsNotLogged = (loginState === LoginStates.LOGOUT || loginState === LoginStates.THROW_OUT);
            });
    }
}
