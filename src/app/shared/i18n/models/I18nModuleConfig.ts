export class I18nModuleConfig {
    constructor(
        public remote?: string,
        public local?: {
            i18n: any,
            langs: any
        },
        public storePrefix?: string
    ){ }
}
