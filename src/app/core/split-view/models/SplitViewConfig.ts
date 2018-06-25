import { Nav } from 'ionic-angular';


export interface SplitViewConfig {
    nav: Nav;
    page: any;
    params?: {
        title?: string,
        icon?: string,
        label?: string
    }
}