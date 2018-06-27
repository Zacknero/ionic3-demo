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
    myChartQuo: any;

    constructor(public navCtrl: NavController, private deviceService: DeviceService) {
    }

    ionViewDidLoad() {
        console.log('QUO_ionViewDidLoad')
        // this.deviceService.isCordova() ? this.deviceService.lockOrientation('portrait') : null;
        this.deviceService.onOrientationChange(
            () => {
                setTimeout(() => {
                    this.myChartQuo.resize();
                }, 100);
            }
        )
    }

    ionViewDidEnter() {
        console.log('QUO_ionViewDidEnter')
        this.myChartQuo ? this.myChartQuo.resize() : this.createSpeedometer();
        // this.myChartQuo.resize();
    }

    ionViewWillEnter(){
        console.log('QUO_ionViewWillEnter')
    }

    ionViewDidLeave() {
        console.log('QUO_ionViewDidLeave')
    }

    ionViewWillLeave() {
        // this.deviceService.isCordova() ? this.deviceService.lockOrientation('landscape') : null;
        console.log('QUO_ionViewWillLeave')
    }

    goToQua() {
        this.navCtrl.push(QuaPage);
    }

    createSpeedometer() {
        this.myChartQuo = echarts.init(this.eChartSpeedometer.nativeElement);
        // let myChartQuo1 = echarts.init(this.eChartSpeedometer1.nativeElement);

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

        this.myChartQuo.setOption(option);
        // myChartQuo1.setOption(option);

        /*setInterval(function () {
            option.series[0].data[0].value = +(Math.random() * 100).toFixed(2) - 0;
            this.myChartQuo.setOption(option, true);
        }, 2000);*/

    }

}
