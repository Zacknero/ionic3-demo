import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';

import * as echarts from 'echarts';
import {DeviceService} from "@core/device/device.service";
import {QuoPage} from "@app/news-tab/pages/quo/quo";

@Component({
    selector: 'page-qui',
    templateUrl: 'qui.html',
})
export class QuiPage {

    @ViewChild('eChartMultiLine') eChartMultiLine: ElementRef;
    myChartQui: any;

    constructor(public navCtrl: NavController, private deviceService: DeviceService) {
    }

    ionViewDidLoad() {
        console.log('QUI_ionViewDidLoad')
        // this.deviceService.isCordova() ? this.deviceService.lockOrientation('landscape') : null;
        this.deviceService.isCordova() ? this.deviceService.unlockOrientation() : null;
        this.deviceService.onOrientationChange(
            () => {
                setTimeout(() => {
                    this.myChartQui.resize();
                }, 100);
            }
        )
    }

    ionViewWillEnter(){
        console.log('QUI_ionViewWillEnter')
    }

    ionViewDidEnter() {
        this.myChartQui ? this.myChartQui.resize() : this.createMultiline();
        console.log('QUI_ionViewDidEnter')
    }

    ionViewDidLeave() {
        console.log('QUI_ionViewDidLeave')
    }

    goToQuo() {
        this.navCtrl.push(QuoPage);
    }

    createMultiline() {

        this.myChartQui = echarts.init(this.eChartMultiLine.nativeElement);

        let option = {
            title: {
                text: 'ECharts'
            },
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                data: ['Topolino', 'Pluto', 'Pippo']
            },
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: 'Topolino',
                type: 'line',
                data: [120.0, 90.9, 17.0, 23.2, 200.6, 86.7, 135.6, 162.2, 32.6, 20.0, 136.4, 43.3]
            },
                {
                    name: 'Pluto',
                    type: 'line',
                    data: [150.6, 60.9, 109.0, 126.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 96.0, 92.3]
                },
                {
                    name: 'Pippo',
                    type: 'line',
                    data: [60.0, 200.2, 150.3, 49.5, 60.3, 100.2, 20.3, 23.4, 23.0, 16.5, 120.0, 36.2]
                }],
            dataZoom: [
                {
                    type: 'inside',
                    xAxisIndex: [0]
                },
                {
                    type: 'inside',
                    yAxisIndex: [0]
                }
            ]
        };

        this.myChartQui.setOption(option);
    }

}
