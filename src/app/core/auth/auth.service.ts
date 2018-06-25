import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@core/api';
import { DeviceService } from '@core/device';
import { ENV } from '@env';
import { Storage } from '@ionic/storage';
import CryptoJS, { AES } from 'crypto-js';
import { Observable } from 'rxjs/Observable';

import { AuthResponse } from './models/AuthResponse';

const storageKeys = {
    token: 'token'
};

@Injectable()
export class AuthService {
    private applicationKey = 'demo-key-0xFF6';
    private accessToken: string|null;
    private refreshToken: string|null;
    private storage: Storage;

    constructor(
        private apiService: ApiService,
        private deviceService: DeviceService
    ){
        this.storage = new Storage({
            name : ENV.appName.replace(/ /g, ''),
            storeName : 'auth',
            driverOrder : ['localstorage']
        });
    }


    /**
     * Get the application key
     * @returns string
     */
    getApplicationKey(): string {
        return this.applicationKey;
    }


    /**
     * Get the current value of accessToken
     * @returns string
     */
    getAccessToken(): string|null {
        return this.accessToken;
    }


    /**
     * Set the accesstoken in memory
     * @param  {string|null=null} accessToken
     */
    setAccessToken(accessToken: string|null = null) {
        this.accessToken = accessToken;
    }


    /**
     * Get the current accessToken
     * @returns string
     */
    getRefreshToken(): string|null {
        return this.refreshToken;
    }


    /**
     * Reset the refreshToken from memory and storage
     * @param  {string|null=null} refreshToken
     */
    setRefreshToken(refreshToken: string|null = null) {
        this.refreshToken = refreshToken;
        let encryptedToken = AES.encrypt(JSON.stringify(refreshToken), this.deviceService.getUUID());
        this.storage.set(storageKeys.token, encryptedToken.toString());
    }


    /**
     * Get the refreshToken from native (secure) storage
     * @returns Promise
     */
    getRefreshTokenFromStorage(): Promise<string|null> {
        return this.storage.get(storageKeys.token).then((cryptedToken: string) => {
            try{
                let plainTokenObj = AES.decrypt(cryptedToken.toString(), this.deviceService.getUUID()).toString(CryptoJS.enc.Utf8);
                return JSON.parse(plainTokenObj);
            }
            catch(e){
                return cryptedToken;
            }
        });
    }


    /**
     * Reset accessToken and refreshToken
     */
    reset() {
        this.setAccessToken();
        this.setRefreshToken();
        this.storage.remove(storageKeys.token);
    }


    /**
     * Fetch the auth tokens using username and password
     * @param {string} username User's username
     * @param {string} password User's password
     */
    authenticate(username: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let credentials = new HttpParams()
                .set('username', username)
                .set('password', password);
            this.apiService.callApi('credentials', null, credentials.toString()).subscribe(
                (res: any) => {
                    this.setAccessToken((res as AuthResponse).accessToken);
                    this.setRefreshToken((res as AuthResponse).refreshToken);
                    resolve();
                },
                reject
            );
        });
    }


    /**
     * Fetch the auth tokens using the eventCode
     * and returns the response in order to save the invitation meetings' ids
     * @param  {string} eventCode
     * @returns Promise
     */
    authenticateAsInvited(eventCode: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let credentials = new HttpParams()
                .set('eventCode', eventCode);
            this.apiService.callApi('eventCode', null, credentials.toString()).subscribe(
                (res: any) => {
                    this.setAccessToken((res as AuthResponse).accessToken);
                    this.setRefreshToken((res as AuthResponse).refreshToken);
                    resolve(res);
                },
                reject
            );
        });
    }


    /**
     * Fetch the auth token for the public access
     * @returns Promise
     */
    fetchPublicAccess(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.apiService.callApi('public').subscribe(
                (res: any) => {
                    this.setAccessToken((res as AuthResponse).accessToken);
                    this.setRefreshToken((res as AuthResponse).refreshToken);
                    resolve((res as AuthResponse).accessToken);
                },
                reject
            );
        });
    }


    /**
     * Get the new accessToken from the actual refreshToken
     * @returns Observable
     */
    fetchAccessToken(refreshToken?: string): Observable<any> {
        // Set the refreshToken as accessToken to obtain a new accessToken
        if(refreshToken){
            this.setAccessToken(refreshToken);
        }
        else {
            this.setAccessToken(this.getRefreshToken());
        }
        const authService = this;
        return this.apiService.callApi('getAccessToken')
            .map((res) => {
                const token = (res as AuthResponse).accessToken;
                authService.setAccessToken(token);
                return token;
            })
            .first();
    }

}
