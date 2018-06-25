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

    constructor(public navCtrl: NavController, private deviceService: DeviceService) {
    }

    ionViewDidLoad() {
        this.deviceService.isCordova() ? this.deviceService.lockOrientation('landscape') : null;
    }

    ionViewDidEnter() {
        this.createMultiline();
    }

    goToQuo() {
        this.navCtrl.push(QuoPage);
    }

    createMultiline() {

        let myChart = echarts.init(this.eChartMultiLine.nativeElement);

        let option = {
            title: {
                text: 'ECharts'
            },
            tooltip: {},
            legend: {
                data:['Topolino','Pluto','Pippo']
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
                data: [20.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
            },
                {
                    name: 'Pluto',
                    type: 'line',
                    data: [50.6, 5.9, 19.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                },
                {
                    name: 'Pippo',
                    type: 'line',
                    data: [60.0, 2.2, 30.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                }]
        };

        myChart.setOption(option);
    }

}
