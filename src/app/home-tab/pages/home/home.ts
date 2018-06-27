import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController} from "ionic-angular";

import {DeviceService} from "@core/device/device.service";
import {Chart} from 'chart.js';
import {Page1Page} from "@app/home-tab";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    @ViewChild('chartCanvasLine') chartCanvasLine: ElementRef;
    chartObject: any;

    constructor( private deviceService: DeviceService, private navCtrl: NavController){
    }

    ionViewDidLoad(){
        console.log('Did Load Home');

    }

    ionViewDidEnter() {
        this.showChartLines();
        // this.deviceService.isCordova() ? this.deviceService.lockOrientation('landscape') : null;
        this.deviceService.isCordova() ? this.deviceService.unlockOrientation() : null;
        console.log('Did Enter Home');
    }

    ionViewDidLeave(){
        console.log('Did Leave Home');
    }

    ionViewCanLeave(){
        console.log('CAN Leave Home');
    }

    goToPage1(){
        this.navCtrl.push(Page1Page);
    }

    showChartLines() {
        this.chartObject = new Chart(this.chartCanvasLine.nativeElement, {
            type: 'line',
            data: {
                labels: ["7/2018", "8/2018", "9/2018", "10/2018", "11/2018", "12/2018", "13/2018", "14/2018"],
                datasets: [{
                    label: 'UPSTREAM',
                    data: [120, 190, 300, 500, 200, 300, 1200, 1100],
                    backgroundColor: [
                        'rgba(0, 0, 153, 1)'

                    ],
                    borderColor: [
                        'rgba(0, 0, 153, 1)'
                    ],
                    fill: false,
                    borderWidth: 1,
                    fontSize: 'smile'
                },
                    {
                        label: 'ATONO',
                        data: [250, 190, 50, 150, 900, 130, 580, 300],
                        backgroundColor: [
                            'rgba(255, 255, 0, 1)'
                        ],
                        borderColor: [
                            'rgba(255, 255, 0, 1)',
                        ],
                        fill: false,
                        borderWidth: 1
                    },
                    {
                        label: 'MOBBOX ',
                        data: [400, 60, 300, 700, 900, 1000, 1100, 800],
                        backgroundColor: [
                            'rgba(153, 76, 0, 1)'
                        ],
                        borderColor: [
                            'rgba(153, 76, 0, 1)'
                        ],
                        fill: false,
                        borderWidth: 1
                    },
                    {
                        label: 'ACOTEL ',
                        data: [1200, 60, 850, 700, 900, 1000, 1100, 800],
                        backgroundColor: [
                            'rgba(0, 153, 0, 1)'
                        ],
                        borderColor: [
                            'rgba(0, 153, 0, 1)'
                        ],
                        fill: false,
                        borderWidth: 1
                    },
                    {
                        label: 'ENGINEERING ',
                        data: [200, 600, 300, 1000, 600, 1000, 100, 800],
                        backgroundColor: [
                            'rgba(204, 0, 102, 1)'
                        ],
                        borderColor: [
                            'rgba(204, 0, 102, 1)'
                        ],
                        fill: false,
                        borderWidth: 1
                    }]
            },
            options: {
                /*'onClick' : function (evt, item) {
                  console.log ('legend onClick', evt);
                  console.log('legd item', item);
                },*/
                legend: {
                    /*onClick: function (evt: any, item: any) {
                        // console.log ('legend onClick', evt);
                        console.log('legd item', item);
                    },*/
                    labels: {
                        fontSize: 12,
                        boxWidth: 12
                    }
                },
                scales: {
                    yAxes: [{
                        gridLines: {
                            drawBorder: false,
                        },
                        ticks: {
                            beginAtZero: true,
                            min: 0,
                            max: 1200,
                            stepSize: 200,
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            display: false,
                            color: 'rgba(202, 15, 108, 1)',
                        }
                    }]
                },
                pan: {
                    enabled: true,
                    mode: 'x',
                    rangeMax: {
                        x: 0,
                        y: 10
                    }
                },
                zoom: {
                    enabled: true,
                    mode: 'x',
                    rangeMax: {
                        x: 0,
                        y: 10
                    }
                }
            }
        });
    }
}
