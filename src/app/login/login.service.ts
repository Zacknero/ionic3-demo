import { Injectable } from '@angular/core';
import { LoginPage } from '@app/login';
import { DeviceService } from '@core/device';
import { LoginStates, UserService } from '@core/user';
import { Modal, ModalController } from 'ionic-angular';

@Injectable()
export class LoginService {
    loginModal: Modal;

    constructor(
        private modalCtrl: ModalController,
        private deviceService: DeviceService,
        private userService: UserService
    ) {
        // Create the main login modal
        this.loginModal = this.modalCtrl.create(LoginPage, {}, {
            showBackdrop: true,
            enableBackdropDismiss: false,
            cssClass: 'login-modal'
        });
        this.initMainLoginModalObservable();
    }

    /**
     * Open the previuosly created main login modal
     */
    public openMainLogin() {
        this.loginModal.present().then(() => {
            this.deviceService.hideLoading();
        });
    }


    /**
     * Start to observe the session's changes in order to open or dismiss it
     */
    private initMainLoginModalObservable(){
        // Listen the session's changes in order to open or dismiss the main login modal
        this.userService.onSessionChanges$.subscribe((loginState: number) => {
            // If the refreshToken expires, the user will be thrown out
            // and the login modal will be presented
            if(loginState === LoginStates.THROW_OUT) {
                this.loginModal.present();
            }
            // If the user logs in dismiss the login modal
            else if(loginState === LoginStates.NEW_USER ||
                    loginState === LoginStates.LAST_USER ||
                    loginState === LoginStates.PUBLIC) {

                    this.loginModal.dismiss();
            }
        });
    }
}
