import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';

import * as echarts from 'echarts';
import {DeviceService} from "@core/device/device.service";
import {QuaPage} from "@app/news-tab/pages/qua/qua";


@Component({
    selector: 'page-quo',
    templateUrl: 'quo.html',
})
export class QuoPage {

    @ViewChild('eChartSpeedometer') eChartSpeedometer: ElementRef;

    // @ViewChild('eChartSpeedometer1') eChartSpeedometer1: ElementRef;


    constructor(public navCtrl: NavController, private deviceService: DeviceService) {
    }

    ionViewDidLoad() {
        this.deviceService.isCordova() ? this.deviceService.lockOrientation('portrait') : null;
    }

    ionViewDidEnter() {
        this.createSpeedometer()
    }

    ionViewWillLeave() {
        this.deviceService.isCordova() ? this.deviceService.lockOrientation('landscape') : null;
    }

    goToQua() {
        this.navCtrl.push(QuaPage);
    }

    createSpeedometer() {
        let myChart = echarts.init(this.eChartSpeedometer.nativeElement);
        // let myChart1 = echarts.init(this.eChartSpeedometer1.nativeElement);

        let option = {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            series: [
                {
                    type: 'gauge',
                    z: 3,
                    min: 0,
                    max: 100,
                    splitNumber: 10,
                    radius: '50%',
                    axisLine: {
                        lineStyle: {
                            width: 6
                        }
                    },
                    axisTick: {
                        length: 8,
                        lineStyle: {
                            color: 'auto'
                        }
                    },
                    axisLabel: {
                        fontSize: 7
                    },
                    splitLine: {
                        length: 6
                    },
                    detail: {
                        fontSize: 12
                    },
                    pointer: {
                        width: 3
                    },
                    data: [{value: 40}]
                }
            ]
        };

        myChart.setOption(option);
        // myChart1.setOption(option);

        setInterval(function () {
            option.series[0].data[0].value = +(Math.random() * 100).toFixed(2) - 0;
            myChart.setOption(option, true);
            // myChart1.setOption(option, true);
        }, 2000);

    }

}
