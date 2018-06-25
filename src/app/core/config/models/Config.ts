import { BackendConfig } from './BackendConfig';
import { VersioningConfig } from './VersioningConfig';

export class Config {
    public lastModified?: string | null;
    public versioning: VersioningConfig[];
    public backend: BackendConfig;
    public loggerLevel: string;
    public devMode: boolean;
    public externalUrls: {
        councilWebsite: string,
        delegatePortal: string,
        feedback: string,
        forgotPassword: string,
        newsRoom: string,
        privacyPolicy: string,
        social: {
            facebook: string,
            twitter: string,
            instagram: string,
            youtube: string,
            googlePlus: string
        },
        votingCalculator: {
            android: string,
            ios: string
        }
    }

    constructor(
        config: Config
    ) {
        this.versioning = config.versioning.map((v: VersioningConfig) => { return new VersioningConfig(v); });
        this.backend = new BackendConfig(config.backend);
        this.loggerLevel = config.loggerLevel || 'ERROR';
        this.devMode = config.devMode || false;
        this.lastModified = config.lastModified || null;
        this.externalUrls = config.externalUrls;
    }

}
