import {Component, ElementRef, ViewChild} from '@angular/core';

import * as echarts from 'echarts';
import {DeviceService} from "@core/device/device.service";

@Component({
    selector: 'page-qua',
    templateUrl: 'qua.html',
})
export class QuaPage {

    @ViewChild('echartMixed') echartMixed: ElementRef;

    constructor(private deviceService: DeviceService) {
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad QuaPage');
        this.deviceService.isCordova() ? this.deviceService.lockOrientation('landscape') : null;
    }

    ionViewDidEnter() {
        this.createMixedChart();
    }

    ionViewWillLeave(){
        this.deviceService.isCordova() ? this.deviceService.lockOrientation('portrait') : null;
    }

    createMixedChart() {
        // app.title = '多 Y 轴示例';

        let myChart = echarts.init(this.echartMixed.nativeElement);

        var colors = ['#5793f3', '#d14a61', '#675bba'];

        let option = {
            color: colors,

            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            grid: {
                right: '20%'
            },
            legend: {
                data: ['TestBlue', 'TestRed', 'TestLine']
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: 'TestBlue',
                    min: 0,
                    max: 250,
                    position: 'right',
                    axisLine: {
                        lineStyle: {
                            color: colors[0]
                        }
                    },
                    axisLabel: {
                        formatter: '{value} ml'
                    }
                },
                {
                    type: 'value',
                    name: 'TestRed',
                    min: 0,
                    max: 250,
                    position: 'right',
                    offset: 80,
                    axisLine: {
                        lineStyle: {
                            color: colors[1]
                        }
                    },
                    axisLabel: {
                        formatter: '{value} ml'
                    }
                },
                {
                    type: 'value',
                    name: 'Flo',
                    min: 0,
                    max: 25,
                    position: 'left',
                    axisLine: {
                        lineStyle: {
                            color: colors[2]
                        }
                    },
                    axisLabel: {
                        formatter: '{value} °C'
                    }
                }
            ],
            series: [
                {
                    name: 'TestBlue',
                    type: 'bar',
                    data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                },
                {
                    name: 'TestRed',
                    type: 'bar',
                    yAxisIndex: 1,
                    data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                },
                {
                    name: 'TestLine',
                    type: 'line',
                    yAxisIndex: 2,
                    data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                }
            ]
        };

        myChart.setOption(option);
    }

}
