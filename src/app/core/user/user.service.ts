import { Injectable, Optional } from '@angular/core';
import { LoginStates, User, UserModuleConfig } from '@app/core/user';
import { ApiService } from '@core/api/api.service';
import { AuthService } from '@core/auth';
import { DeviceService } from '@core/device';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

const profileValidity = 1000 * 60 * 60 * 24;     // The user data is valid for only 24 hours (86400000 mills)

const storageKeys = {
    user: 'user',
    public: 'public',
    firstAccess: 'firstAccess'
};

@Injectable()
export class UserService {
    private user: User|null;
    private storage: Storage;
    private firstAccess: boolean = true;
    private publicAccess: boolean = false;
    // Observable to share user login changes
    public onSessionChanges$: Subject<number> = new Subject();

    constructor(
        @Optional() public config: UserModuleConfig,
        private apiService: ApiService,
        private authService: AuthService,
        private deviceService: DeviceService
    ){
        this.storage = new Storage({
            name : config.storePrefix || 'storage',
            storeName : 'user',
            driverOrder : ['localstorage']
        });
        this.storage.get(storageKeys.firstAccess).then((isFirstAccess: boolean) => {
            // If firstAccess flag doesn't exists create it with true value
            if(typeof isFirstAccess === 'undefined' || isFirstAccess === null){
                this.setFirstAccess(true);
            }
            else {
                this.firstAccess = isFirstAccess;
            }
        });
        this.storage.get(storageKeys.public).then((isPublic: boolean) => {
            if(typeof isPublic === 'undefined' || isPublic === null){
                this.publicAccess = false;
            }
            else {
                this.publicAccess = isPublic;
            }
        });
        this.deviceService.networkStatusChanges$.subscribe((isOnline: boolean) => {
            if(isOnline){
                this.autologin();
            }
        });
    }


    /**
     * Returns the user full name
     * @returns string
     */
    getFullName(): string {
        if(this.user){
            return this.user.getFullName();
        }
        return '';
    }


    /**
     * Returns if user is logged
     * @returns boolean
     */
    isLogged(): boolean {
        if(this.user) {
            return this.user.isLogged();
        }
        return false;
    }


    /**
     * Return the current value for public access mode
     * @returns boolean
     */
    isPublicAccess(): boolean {
        return this.publicAccess;
    }


    /**
     * Set the public access flag in memory and storage
     * @param  {boolean} publicAccess
     */
    setPublicAccess(publicAccess: boolean) {
        this.publicAccess = publicAccess;
        this.storage.set(storageKeys.public, publicAccess);
    }


    /**
     * Makes login with classic username and password
     * @param {string} username User's username
     * @param {string} password User's password
     */
    login(username: string, password: string): Promise<any>{
        return new Promise((resolve, reject) => {
            this.authService.authenticate(username, password).then(
                () => {
                    this.fetchUserProfile(username).subscribe(
                        (res: any) => {
                            try{
                                this.startSession(username, res.data.users.items[0]);
                                this.setFirstAccess();
                                resolve();
                            }
                            catch(err){
                                reject(err);
                            }
                        },
                    );
                },
                (err: Error) => {
                    reject(err);
                }
            );
        });
    }


    /**
     * Fetch the accessToken and the refreshToken for public access
     * @returns Promise
     */
    accessAsPublic(): Promise<any> {
        return new Promise((resolve, reject) => {
            // If the device is online try the login
            if(this.deviceService.isOnline()){
                this.authService.fetchPublicAccess().then(
                    () => {
                        this.setFirstAccess();
                        this.setPublicAccess(true);
                        this.onSessionChanges$.next(LoginStates.PUBLIC);
                        resolve();
                    },
                    (err: Error) => {
                        reject(err);
                    }
                );
            }
            // Otherwise enter in app wit a fake accessToken
            // The app will use the DB and when online will be fetch the new accessToken with interceptor
            else {
                resolve();
            }
        });
    }

    /**
     * If the refreshToken is stored try to use it to fetch a new accessToken
     * after that get the last user info in storage to use as user and go in
     */
    autologin(): Promise<any>{
        return new Promise((resolve, reject) => {
            // If the user has already access to the app check user info
            if(!this.isFirstAccess()){
                // Get the refreshToken
                this.authService.getRefreshTokenFromStorage().then((refreshToken: string|null) => {
                    if(refreshToken){
                        // If the last session was in public access get new accessToken and go on
                        if(this.isPublicAccess()){
                            this.accessAsPublic().then(
                                resolve,
                                reject
                            );
                        }
                        // Otherwise get the new user access token
                        else {
                            // If the device is online try to get the new access token
                            if(this.deviceService.isOnline()){
                                this.authService.fetchAccessToken(refreshToken).subscribe(
                                    () => {
                                        // And restore last user session
                                        this.restoreLastSession().then(
                                            resolve,
                                            reject
                                        )
                                    },
                                    reject
                                );
                            }
                            // Otherwise enter in app without set accessToken
                            // The app will use the DB and when online will be fetch the new accessToken with interceptor
                            else {
                                // And restore last user session
                                this.restoreLastSession().then(
                                    resolve,
                                    reject
                                )
                            }
                        }
                    }
                    else {
                        reject();
                    }
                })
            }
            // Otherwise reject and go to login page
            else {
                reject();
            }
        });
    }


    /**
     * Get user's information using the backend GraphQL
     * @param {string} username User's username
     */
    fetchUserProfile(username: string): Observable<any> {
        const query = {
            query : `
                query {
                    users(userCodes: "${username}") {
                        items {
                            id
                            firstName
                            lastName
                            profile {
                                communitiesByPreference {
                                    id
                                    shortName
                                    nameEn
                                    nameFr
                                }
                                communitiesByMembership {
                                    community {
                                        id
                                        shortName
                                        nameEn
                                        nameFr
                                    }
                                }
                            }
                        }
                    }
                }`
        };
        return this.apiService.callApi('getUserProfile', null, query);
    }


    refreshUserProfile(){
        return new Promise((resolve, reject) => {
            // If the current profile data was refreshed during last 24 hours => resolve
            if(new Date().getTime() - (this.user as User).timestamp < profileValidity){
                resolve();
            }
            // Otherwise if the user is loggd I can update its data (if online)
            else if(this.deviceService.isOnline() && this.isLogged()){
                this.fetchUserProfile((this.user as User).username).subscribe(
                    (res: any) => {
                        try{
                            this.startSession((this.user as User).username, res.data.users.items[0]);
                            this.setFirstAccess();
                            resolve();
                        }
                        catch(err){
                            reject(err);
                        }
                    },
                );
            }
            else {
                resolve();
            }
        });
    }


    /**
     * Get the firstAccess flag to use for public access
     * @returns Promise
     */
    isFirstAccess(): boolean{
        return this.firstAccess;
    }


    /**
     * Set the firstAccess flag to use for public access
     * As default the firstAccess flag will be disabled
     */
    setFirstAccess(firstAccess: boolean = false){
        this.firstAccess = firstAccess;
        this.storage.set(storageKeys.firstAccess, firstAccess);
    }


    /**
     * Set the user information in localStorage,
     * init the user info in memory
     * and set isPublic to false
     * @param  {User} userData
     */
    startSession(username: string, userData: User) {
        userData.username = username;
        userData.timestamp = new Date().getTime();
        this.storage.set(storageKeys.user, userData);
        this.setPublicAccess(false);
        this.user = new User(userData);
        this.storage.get(storageKeys.user).then((lastUser: User) => {
            if(lastUser && lastUser.id === userData.id){
                this.onSessionChanges$.next(LoginStates.LAST_USER);
            }
            else {
                this.onSessionChanges$.next(LoginStates.NEW_USER);
            }
        });
    }


    restoreLastSession() {
        return new Promise((resolve, reject) => {
            // If the user is logged I can update its data (if online)
            if(this.deviceService.isOnline() && this.isLogged()){
                this.fetchUserProfile((this.user as User).username).subscribe(
                    (res: any) => {
                        try{
                            this.startSession((this.user as User).username, res.data.users.items[0]);
                            this.setFirstAccess();
                            resolve();
                        }
                        catch(err){
                            reject(err);
                        }
                    },
                );
            }
            // Otherwise the user is an invited one, so I can0't update its data
            else {
                this.storage.get(storageKeys.user).then((lastUser: User) => {
                    if(lastUser){
                        this.user = new User(lastUser);
                        resolve();
                    }
                    else {
                        reject(new Error('ERR_NO_LAST_USER_INFO'));
                    }
                });
            }
        });
    }


    /**
     * Destroy the user session and the user info in DB
     */
    endSession() {
        this.user = null;
        this.storage.remove(storageKeys.user);
    }


    /**
     * Logout the user,
     * destroy all his references
     * and get new accessToken for public access
     * @param  {LoginStates} loginState LOGOUT if user logs out or THROW_OUT if the refreshToken expire
     */
    logout(loginState: LoginStates): void {
        this.deviceService.showLoading();
        this.endSession();
        this.onSessionChanges$.next(loginState);
    }
}
