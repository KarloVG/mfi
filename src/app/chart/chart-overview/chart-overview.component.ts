import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ChartService } from '../services/chart-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { IChartResponse } from '../models/chart-response';

@Component({
  selector: 'app-chart-overview',
  templateUrl: './chart-overview.component.html',
  styleUrls: ['./chart-overview.component.scss']
})

export class ChartOverviewComponent implements OnInit, OnDestroy {
  moduleName: string = 'Graf financijskih transakcija';
  moduleFontIcon: string = 'fas fa-chart-pie';
  displayType: string = 'chart';

  chartResponseData: IChartResponse;
  constructor(
    private chartService: ChartService
  ) {}

  pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          return value + ' Kn';
        },
      },
    }
  };
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins = [pluginDataLabels];

  colors = ['rgb(0,206,209)', 'rgb(30,144,255)', 'rgb(239, 192, 80)','rgb(136, 176, 75)', 'rgb(68, 184, 172)', 'rgb(225, 93, 68)', 'rgb(89, 160, 0)'
  , 'rgb(255, 160, 0)', 'rgb(255, 230, 0)', 'rgb(255, 137, 255)', 'rgb(17, 137, 255)', 'rgb(185, 77, 0)', 'rgb(185, 77, 120)', 'rgb(185, 77, 34)', 'rgb(185, 255, 0)'
  , 'rgb(230, 117, 0)'];
  pieChartColorsI = [{ backgroundColor: [this.colors[Math.floor(Math.random() * this.colors.length)], this.colors[Math.floor(Math.random() * this.colors.length)], this.colors[Math.floor(Math.random() * this.colors.length)], this.colors[Math.floor(Math.random() * this.colors.length)], this.colors[Math.floor(Math.random() * this.colors.length)]]}];
  pieChartColorsU = [{ backgroundColor: [this.colors[Math.floor(Math.random() * this.colors.length)], this.colors[Math.floor(Math.random() * this.colors.length)], this.colors[Math.floor(Math.random() * this.colors.length)], this.colors[Math.floor(Math.random() * this.colors.length)], this.colors[Math.floor(Math.random() * this.colors.length)]]}];

  pieChartLabelsU: Label[] = [];
  pieChartLabelsI: Label[] = [];
  pieChartDataU: number[] = [];
  pieChartDataI: number[] = [];

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'center'
      }
    }
  };
  barChartType: ChartType = 'horizontalBar';
  barChartLegend = true;
  barChartPlugins = [pluginDataLabels];

  barChartLabelsU: Label[] = [];
  barChartLabelsI: Label[] = [];

  barChartColorU: Color[] = [
    { backgroundColor: this.colors[Math.floor(Math.random() * this.colors.length)] }
  ];
  barChartColorI: Color[] = [
    { backgroundColor: this.colors[Math.floor(Math.random() * this.colors.length)] }
  ];

  barChartDataU: ChartDataSets[] = [{ data: [], label: 'Uplate' }]
  barChartDataI: ChartDataSets[] = [{ data: [], label: 'Isplate' }]

  entriesMin: number = 1
  entriesMax: number = 90

  onChangeOsobaOrIzvod(event) {
    this.pieChartDataI = [];
    this.pieChartDataU = [];
    this.pieChartLabelsI = [];
    this.pieChartLabelsU = [];
    this.barChartDataI[0].data = [];
    this.barChartDataU[0].data = [];
    this.barChartLabelsI = [];
    this.barChartLabelsU = [];
    
    if(event.osobaID) {
      this.chartService.getChartData(event.osobaID, event.izvodID).pipe(untilComponentDestroyed(this)).subscribe(
        data => {
          this.chartResponseData = data;
          this.chartResponseData.ulazneTransakcijePoOsobi.forEach(
            poOsobi => {
              this.barChartLabelsU.push(poOsobi.osoba);
              this.barChartDataU[0].data.push(poOsobi.iznos);
            }
          );
          this.chartResponseData.izlazneTransakcijePoOsobi.forEach(
            poOsobi => {
              this.barChartLabelsI.push(poOsobi.osoba);
              this.barChartDataI[0].data.push(poOsobi.iznos);
            }
          );
          this.chartResponseData.izlazneTransakcijePoDrzavi.forEach(
            poOsobi => {
              this.pieChartLabelsI.push(poOsobi.drzava);
              this.pieChartDataI.push(poOsobi.iznos);
            }
          );
          this.chartResponseData.ulazneTransakcijePoDrzavi.forEach(
            poOsobi => {
              this.pieChartLabelsU.push(poOsobi.drzava);
              this.pieChartDataU.push(poOsobi.iznos);
            }
          );
        }
      )
    }
  }

  chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  addUser() { }

  expandView() {
    console.log('Chart', 'expandViewAction')
  }
  contractView() {
    console.log('Chart', 'contractViewAction')
  }
  notifications() {
    console.log('Chart', 'notificationsAction')
  }
  filter() {
    console.log('Chart', 'filtersAction')
  }
  export() {
    console.log('Chart', 'exportAction')
  }

  shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
  }

  rndmm(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}
