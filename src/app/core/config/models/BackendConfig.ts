import { ApiConfig } from './ApiConfig';
import { RequestMethods } from './RequestMethods';

export class BackendConfig {
    public baseUrl: string;
    public api: ApiConfig[];
    public environment?: string;

    constructor(
        backend: Partial<BackendConfig>
    ) {
        this.baseUrl = <string>backend.baseUrl;
        this.api = (backend.api as ApiConfig[]).map((a: ApiConfig) => { return new ApiConfig(a); });
        this.environment = backend.environment || 'PROD';
    }


    public getApiConfig(apiName:string): ApiConfig|null {
        let api;
        try {
            api = <ApiConfig>this.api.find(api => api.name === apiName);
            api.url = this.prepareUrl(api.url);
        }
        catch(err){
            api = null;
        }
        return api;
    }


    /**
     * Get api configuration from the config.json file
     * @param url string HTTP request's url
     * @param method string HTTP request's method
     * @returns {ApiConfig|null}
     */
    public createNewApiConfig(url: string, method: string = RequestMethods.GET): ApiConfig {
        url = this.prepareUrl(url);
        let apiConfig = new ApiConfig(<ApiConfig>{
            url : url,
            method : method
        });
        return apiConfig;
    }


    /**
     * Add baseUrl as prefix if the api url is relative
     * @param {string} url Relative api url
     */
    private prepareUrl(url: string): string {
        if (url.trim().indexOf('http') !== 0) {
            url = (this.baseUrl + url).trim();
        }
        return url;
    }
}
