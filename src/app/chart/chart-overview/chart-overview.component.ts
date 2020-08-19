import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-chart-overview',
  templateUrl: './chart-overview.component.html',
  styleUrls: ['./chart-overview.component.scss']
})

export class ChartOverviewComponent implements OnInit {
  moduleName: string = 'Graf financijskih transakcija';
  moduleFontIcon: string = 'fas fa-chart-pie';
  displayType: string = 'chart'

  constructor() {}

  pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins = [pluginDataLabels];
  pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)', 'rgba(128,0,128,0.3)', 'rgba(128,128,0,0.3)', 'rgba(0,128,128,0.3)'],
    },
  ];

  pieChartLabels: Label[] = [
    'Hrvatska',
    'Bosna i Hercegovina',
    'Grčka',
    'Ujedinjeno Kraljevstvo',
    'Estonija',
    'Sjedinjene Američke Države',
    'Irska',
    'Srbija',
    'Crna Gora',
    'Austrija',
    'Slovenija',
    'Italija',
    'Njemačka',
    'Francuska',
    'Malta',
    'Cipar',
    'Španjolska',
    'Portugal',
  ];

  pieChartLabelsU: Label[] = [];
  pieChartLabelsI: Label[] = [];
  pieChartDataU: number[] = [];
  pieChartDataUx: number[] = [69.8, 0.7, 2, 18.9, 4.9, 3.7];
  pieChartDataI: number[] = [];
  pieChartDataIx: number[] = [10.1, 1.2, 4.3, 4.3, 61.8, 18.3];

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  barChartType: ChartType = 'horizontalBar';
  barChartLegend = true;
  barChartPlugins = [pluginDataLabels];

  barChartLabelsU: Label[] = ['Boško Bošković', 'ACME Ltd.', 'Marko Markić', 'Dobra Tvrtka d.o.o.', 'Ivana Ivić', 'Ana Anić'];
  barChartLabelsI: Label[] = ['Petar Petrović', 'Franjo Franjić', 'Nina Ninić', 'ACME Ltd. (UK)', 'Luka Lukač', 'Ana Anić'];

  barChartColors1 = 'rgba(0,255,0,0.3)'
  barChartColors2 = 'rgba(255,0,0,0.3)'

  barChartDataU: ChartDataSets[] = [{ data: [], label: 'Uplate' }]
  barChartDataUx: ChartDataSets[] = [
    { data: [21000, 60000, 24000, 77000, 11000, 44000], label: 'Uplate' }
  ];
  barChartDataI: ChartDataSets[] = [{ data: [], label: 'Isplate' }]
  barChartDataIx: ChartDataSets[] = [
    { data: [21000, 60000, 24000, 77000, 11000, 44000], label: 'Isplate' }
  ];

  entriesMin: number = 1
  entriesMax: number = 90

  onChangeOsobaOrIzvod() {
    
  }

  chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  ngOnInit(): void {}

  addUser() {
    console.log('Chart', 'addUser')
    this.barChartDataU[0].data = []
    for (let u = 1; u <= this.barChartLabelsU.length; u++) {
      this.barChartDataU[0].data.push(this.rndmm(this.entriesMin, this.entriesMax) * 1000)
    }
    this.barChartDataI[0].data = []
    for (let i = 1; i <= this.barChartLabelsI.length; i++) {
      this.barChartDataI[0].data.push(this.rndmm(this.entriesMin, this.entriesMax) * 1000)
    }

    this.pieChartLabelsU = []
    this.pieChartLabelsU.push(this.pieChartLabels[0])
    for (let i = 1; i <= 5; i++) {
      this.pieChartLabelsU.push(this.pieChartLabels[this.rndmm(1, this.pieChartLabels.length - 1)])
    }
    this.pieChartLabelsI = []
    this.pieChartLabelsI.push(this.pieChartLabels[0])
    for (let i = 1; i <= 5; i++) {
      this.pieChartLabelsI.push(this.pieChartLabels[this.rndmm(1, this.pieChartLabels.length - 1)])
    }

    this.shuffle(this.pieChartDataUx)
    this.pieChartDataU = this.pieChartDataUx
    this.shuffle(this.pieChartDataIx)
    this.pieChartDataI = this.pieChartDataIx
  }

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
