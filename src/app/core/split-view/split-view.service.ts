import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { SplitView } from './models/SplitView';
import { SplitViewConfig } from './models/SplitViewConfig';

@Injectable()
export class SplitViewService {
    private isOn: boolean = false;
    private splitViewList: {[name : string] : SplitView} = {};
    public isOn$: Subject<boolean> = new Subject<boolean>();

    constructor(

    ){ }


    initSplitView(name: string, masterView: SplitViewConfig, detailView: SplitViewConfig) {
        if(name && !this.splitViewList[name]){
            this.splitViewList[name] = new SplitView(masterView.nav, detailView.nav, this.isOn, this.isOn$);
            this.splitViewList[name].initMaster(masterView.page, masterView.params);
            this.splitViewList[name].initDetail(detailView.page, detailView.params);
        }
        return this.splitViewList[name];
    }


    getSplitView(name: string): SplitView {
        return this.splitViewList[name];
    }


    isActive(): boolean {
        return this.isOn;
    }


    onSplitPaneChanged(isOn: boolean) {
        this.isOn = isOn;
        this.isOn$.next(this.isOn);
    }


    activateSplitView(){
        this.onSplitPaneChanged(true);
    }


    deactivateSplitView(){
        this.onSplitPaneChanged(false);
    }



}
