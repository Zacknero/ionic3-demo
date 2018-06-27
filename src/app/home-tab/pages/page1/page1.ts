import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Chart} from 'chart.js';
import {Page2Page} from "@app/home-tab/pages/page2/page2";

@Component({
    selector: 'page-page1',
    templateUrl: 'page1.html',
})
export class Page1Page {

    @ViewChild('chartCanvasSpeedometer') chartCanvasSpeedometer: ElementRef;

    constructor(public navCtrl: NavController) {
    }

    ionViewDidLoad(){
        this.shoSpeedometro();
    }

    ionViewDidEnter() {
        // this.deviceService.isCordova() ? this.deviceService.lockOrientation('portrait') : null;
    }

    ionViewWillLeave(){
        // this.deviceService.isCordova() ? this.deviceService.lockOrientation('landscape') : null;
    }

    goToPage2() {
        this.navCtrl.push(Page2Page);
    }

    shoSpeedometro() {
        Chart.defaults.gauge = Chart.defaults.doughnut;

        var gauge = Chart.controllers.doughnut.extend({
            draw: function (ease: any) {
                Chart.controllers.doughnut.prototype.draw.call(this, ease);
                var meta = this.getMeta();
                var pt0 = meta.data[0];

                var ctx = this.chart.chart.ctx;
                ctx.save();

                var cx = pt0._view.x;
                var cy = pt0._view.y;
                // var innerRadius = pt0._view.innerRadius;
                var outerRadius = pt0._view.outerRadius;
                var config = this.chart.chart.config;
                var current = config.data.current;
                var max = config.options.panel.max;
                var min = config.options.panel.min;
                var needle = config.options.needle;
                var panel = config.options.panel;
                if (current >= max) {
                    current = max;
                }
                if (current <= min) {
                    current = min;
                }
                var needleAngle = config.options.circumference * (current - min) / (max - min) + config.options.rotation;
                var radius = outerRadius * needle.lengthRadius / 100;
                var textRadius = outerRadius * panel.scaleTextRadius / 100;

                ctx.translate(cx, cy);
                ctx.font = "" + panel.scaleTextSize + "px, Helvetica, Arial, sans-serif";
                ctx.fillStyle = panel.scaleTextColor || 'rgba(255, 255, 255, 1)';
                panel.scales.forEach(function (value: any, index: any, arr: any) {
                    var textWidth = ctx.measureText("" + value).width;
                    var textAngle = config.options.circumference * index / (arr.length - 1) + config.options.rotation;
                    var dy = textRadius * Math.sin(textAngle);
                    var dx = textRadius * Math.cos(textAngle);
                    ctx.fillText("" + value, dx - (textWidth / 2), dy);
                    var oy = (outerRadius * panel.scaleOuterRadius / 100) * Math.sin(textAngle);
                    var ox = (outerRadius * panel.scaleOuterRadius / 100) * Math.cos(textAngle);
                    var iy = (outerRadius * panel.scaleInnerRadius / 100) * Math.sin(textAngle);
                    var ix = (outerRadius * panel.scaleInnerRadius / 100) * Math.cos(textAngle);
                    ctx.strokeStyle = panel.scaleColor || 'rgba(0, 0, 0, 1)';
                    ctx.beginPath();
                    ctx.moveTo(ix, iy);
                    ctx.lineTo(ox, oy);
                    ctx.stroke();
                });
                ctx.restore();

                ctx.save();
                ctx.translate(cx, cy);
                ctx.strokeStyle = panel.tickColor || 'rgba(0, 0, 0, 1)';
                ctx.beginPath();
                this.chart.chart.config.data.datasets[0].values.forEach(function (value: any) {
                    // var textWidth = ctx.measureText("" + value).width;
                    var textAngle = config.options.circumference * (value - min) / (max - min) + config.options.rotation;
                    var oy = (outerRadius * panel.tickOuterRadius / 100) * Math.sin(textAngle);
                    var ox = (outerRadius * panel.tickOuterRadius / 100) * Math.cos(textAngle);
                    var iy = (outerRadius * panel.tickInnerRadius / 100) * Math.sin(textAngle);
                    var ix = (outerRadius * panel.tickInnerRadius / 100) * Math.cos(textAngle);
                    ctx.moveTo(ix, iy);
                    ctx.lineTo(ox, oy);
                });
                ctx.stroke();
                ctx.restore();

                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(needleAngle);
                ctx.beginPath();
                ctx.moveTo(0, -needle.width);
                ctx.lineTo(radius, 0);
                ctx.lineTo(0, needle.width);
                ctx.fillStyle = needle.color || 'rgba(180, 0, 0, 0.8)';
                ctx.fill();
                ctx.rotate(-needleAngle);
                ctx.translate(-cx, -cy);
                ctx.beginPath();
                ctx.fillStyle = needle.circleColor || 'rgba(188, 188, 188, 1)';
                ctx.arc(cx, cy, needle.circleRadius, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            },

            initialize: function (chart: any, datasetIndex: any) {
                var panel = chart.chart.config.options.panel;
                var data = [20, 60, 20];
                // var backgroundColor = [panel.scaleBackgroundColor || "rgb(120, 120, 120)"];
                // var hoverBackgroundColor = [panel.scaleBackgroundColor || "rgb(120, 120, 120)"];

                var values = [];
                for (var v = panel.min; v <= panel.max; v += panel.tickInterval) {
                    values.push(v);
                }

                chart.chart.config.data.datasets[0].data = data;
                chart.chart.config.data.datasets[0].backgroundColor = [
                    'rgb(145, 194, 172)',
                    'rgb(102, 133, 158)',
                    'rgb(198, 52, 49)'
                ];
                chart.chart.config.data.datasets[0].hoverBackgroundColor = [
                    'rgb(145, 194, 172)',
                    'rgb(102, 133, 158)',
                    'rgb(198, 52, 49)'
                ];
                chart.chart.config.data.datasets[0].values = values;

                Chart.controllers.doughnut.prototype.initialize.call(this, chart, datasetIndex);
            }
        });

        Chart.controllers.gauge = gauge;

        let numberSpeed = 84;

        new Chart(this.chartCanvasSpeedometer.nativeElement, {
            "type": "gauge",
            "data": {
                "datasets": [
                    {
                        "data": [],
                        "backgroundColor": [],
                        "borderWidth": 0,
                        "hoverBackgroundColor": [],
                        "hoverBorderWidth": 0
                    }
                ],
                'current': numberSpeed,
            },
            "options": {
                "panel": {
                    "min": 0,
                    "max": 100,
                    "tickInterval": 2,
                    "tickColor": "rgb(255, 255, 255)",
                    "tickOuterRadius": 99,
                    "tickInnerRadius": 95,
                    "scales": [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                    "scaleColor": "rgb(255, 255, 255)",
                    "scaleBackgroundColor": "rgb(105, 125, 151)",
                    "scaleTextRadius": 75,
                    "scaleTextSize": 5,
                    "scaleTextColor": "rgba(0, 0, 0, 1)",
                    "scaleOuterRadius": 99,
                    "scaleInnerRadius": 93,
                },
                "needle": {
                    "lengthRadius": 100,
                    "circleColor": "rgb(102, 133, 158)",
                    "color": "rgb(102, 133, 158)",
                    "circleRadius": 5,
                    "width": 5,
                },
                "cutoutPercentage": 90,
                "rotation": (1 / 2 + 1 / 3) * Math.PI,
                "circumference": 2 * Math.PI * 2 / 3,
                "legend": {
                    "display": false,
                    "text": "legend"
                },
                "tooltips": {
                    "enabled": false
                },
                "title": {
                    "display": true,
                    "text": numberSpeed,
                    "position": "bottom",
                },
                "animation": {
                    "animateRotate": false,
                    "animateScale": false
                },
                "hover": {
                    "mode": null
                }
            }
        })
    }

}
