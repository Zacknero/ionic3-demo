import {Component, ElementRef, ViewChild} from '@angular/core';

import {DeviceService} from "@core/device/device.service";
import {Chart} from 'chart.js';

@Component({
    selector: 'page-page2',
    templateUrl: 'page2.html',
})
export class Page2Page {

    chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
    };

    _seed = Date.now();

    @ViewChild('chartCanvasMultiChart') chartCanvasMultiChart: ElementRef;


    constructor(private deviceService: DeviceService) {
    }

    ionViewDidLoad(){
        this.drawCombinedChart();
    }

    ionViewDidEnter() {
        console.log('ionViewDidLoad ProvaPage');
        this.deviceService.isCordova() ? this.deviceService.lockOrientation('landscape') : null;
    }

    ionViewWillLeave(){
        this.deviceService.isCordova() ? this.deviceService.lockOrientation('portrait') : null;
    }

    drawCombinedChart() {

        let color = Chart.helpers.color;

        const create = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [{
                type: 'bar',
                label: 'Dataset 1',
                backgroundColor: color(this.chartColors.red).alpha(0.2).rgbString(),
                borderColor: this.chartColors.red,
                yAxisID: 'data-set-1',
                data: [
                    this.randomScalingFactor(),
                    this.randomScalingFactor(),
                    this.randomScalingFactor(),
                    this.randomScalingFactor(),
                    this.randomScalingFactor(),
                    this.randomScalingFactor(),
                    this.randomScalingFactor()
                ]
            }, {
                type: 'line',
                label: 'Dataset 2',
                backgroundColor: color(this.chartColors.blue).alpha(0.2).rgbString(),
                borderColor: this.chartColors.blue,
                fill: false,
                yAxisID: 'data-set-2',
                data: [
                    this.randomScalingFactor(),
                    this.randomScalingFactor(),
                    this.randomScalingFactor(),
                    this.randomScalingFactor(),
                    this.randomScalingFactor(),
                    this.randomScalingFactor(),
                    this.randomScalingFactor()
                ]
            },
                {
                    type: 'bar',
                    label: 'Dataset 3',
                    backgroundColor: color(this.chartColors.green).alpha(0.2).rgbString(),
                    borderColor: this.chartColors.green,
                    data: [
                        this.randomScalingFactor(),
                        this.randomScalingFactor(),
                        this.randomScalingFactor(),
                        this.randomScalingFactor(),
                        this.randomScalingFactor(),
                        this.randomScalingFactor(),
                        this.randomScalingFactor()
                    ]
                }]
        };

        new Chart(this.chartCanvasMultiChart.nativeElement, {
            type: 'bar',
            data: create,
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Chart.js Combo Bar Line Chart'
                },
                scales: {
                    yAxes: [{
                        type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                        display: true,
                        position: 'left',
                        id: 'data-set-2',
                    },
                        {
                            type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                            display: true,
                            position: 'right',
                            id: 'data-set-1',
                            gridLines: {
                                drawOnChartArea: false
                            }
                        }],
                },
                legend: {
                    labels: {
                        fontSize: 15
                    }
                }
            }
        });

    }

    randomScalingFactor() {
        return Math.round(this.rand(-100, 100));
    }


    rand(min: any, max: any) {
        var seed = this._seed;
        min = min === undefined ? 0 : min;
        max = max === undefined ? 1 : max;
        this._seed = (seed * 9301 + 49297) % 233280;
        return min + (this._seed / 233280) * (max - min);
    }

}
