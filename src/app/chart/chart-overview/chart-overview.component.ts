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
  ) { }

  zbrojIsplata: number = 0;
  zbrojUplata: number = 0;
  pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'bottom',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;
          dataArr.forEach(data => {
              sum += data;
          });
          let percentage = (value*100 / sum).toFixed(2)+"%";
          return percentage;
        },
      },
    }
  };
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins = [pluginDataLabels];
  pieChartColorsI = [{ backgroundColor: ['rgb(135,206,250)', 'rgb(255,215,0)', 'rgb(255,127,80)', 'rgb(147,112,219)', 'rgb(169,169,169)', 'rgb(154,205,50)', 'rgb(124,252,0)'] }];
  pieChartColorsU = [{ backgroundColor: ['rgb(154,205,50)', 'rgb(169,169,169)', 'rgb(124,252,0)', 'rgb(147,112,219)', 'rgb(255,215,0)', 'rgb(255,127,80)', 'rgb(135,206,250)'] }];

  pieChartLabelsU: Label[] = [];
  pieChartLabelsI: Label[] = [];
  pieChartDataU: number[] = [];
  pieChartDataI: number[] = [];

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        stacked: true,
        ticks: {
          fontColor: 'black',
          fontSize: 15,
          min: 0,
          beginAtZero: true,
          callback: function(label: number){return  label.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' HRK';}
        }
      }],
      yAxes: [{
        stacked: true,
        ticks: {
          fontColor: 'black',
          fontSize: 13
        },
        gridLines: {
          color: '#5f5e5e'
        }
      }]
    },
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
    { backgroundColor: 'rgb(250,128,114)' }
  ];
  barChartColorI: Color[] = [
    { backgroundColor: 'rgb(0,191,255)' }
  ];

  barChartDataU: ChartDataSets[] = [{ data: [], label: 'Uplate' }]
  barChartDataI: ChartDataSets[] = [{ data: [], label: 'Isplate' }]

  entriesMin: number = 1
  entriesMax: number = 90

  onChangeOsobaOrIzvod(event): void {
    this.pieChartDataI = [];
    this.pieChartDataU = [];
    this.pieChartLabelsI = [];
    this.pieChartLabelsU = [];
    this.barChartDataI[0].data = [];
    this.barChartDataU[0].data = [];
    this.barChartLabelsI = [];
    this.barChartLabelsU = [];
    this.zbrojIsplata = 0;
    this.zbrojUplata = 0;

    if (event.osobaID) {
      this.chartService.getChartData(event.osobaID, event.izvodID).pipe(untilComponentDestroyed(this)).subscribe(
        data => {
          this.chartResponseData = data;
          this.chartResponseData.ulazneTransakcijePoOsobi.forEach(
            poOsobi => {
              this.barChartLabelsU.push(poOsobi.osoba);
              this.barChartDataU[0].data.push(poOsobi.iznos);
              this.zbrojUplata += poOsobi.iznos;
            }
          );
          this.chartResponseData.izlazneTransakcijePoOsobi.forEach(
            poOsobi => {
              this.barChartLabelsI.push(poOsobi.osoba);
              this.barChartDataI[0].data.push(poOsobi.iznos);
              this.zbrojIsplata += poOsobi.iznos;
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

  ngOnInit(): void { }

  ngOnDestroy(): void { }

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
}
