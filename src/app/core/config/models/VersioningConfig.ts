
export class VersioningConfig {
    public platform: string;
    public isLastVersion: boolean;
    public isMandatoryUpdate: boolean;
    public storeLink: string;

    constructor(
        versioning: VersioningConfig
    ) {
        this.platform = versioning.platform;
        this.isLastVersion = versioning.isLastVersion;
        this.isMandatoryUpdate = versioning.isMandatoryUpdate;
        this.storeLink = versioning.storeLink;
    }
}
