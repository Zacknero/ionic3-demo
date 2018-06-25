import { Component } from '@angular/core';
import { IonicPage, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-placeholder',
    templateUrl: 'placeholder.html',
})
export class PlaceholderPage {
    title: string = '';
    icon: string = '';
    label: string = '';

    constructor(
        private navParams: NavParams
    ) {
        this.title = this.navParams.get('title');
        this.icon = this.navParams.get('icon');
        this.label = this.navParams.get('label');
    }

}
