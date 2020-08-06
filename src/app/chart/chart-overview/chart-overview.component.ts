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
  moduleFontIcon = 'fas fa-chart-pie';

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

  pieChartLabels1: Label[] = ['Hrvatska', 'Bosna i Hercegovina', 'Grčka', 'Ujedinjeno Kraljevstvo', 'Estonija', 'Sjedinjene Američke Države'];
  pieChartLabels2: Label[] = ['Hrvatska', 'Bosna i Hercegovina', 'Grčka', 'Ujedinjeno Kraljevstvo', 'Irska', 'Srbija'];
  pieChartData1: number[] = [69.8, 0.7, 2, 18.9, 4.9, 3.7];
  pieChartData2: number[] = [10.1, 1.2, 4.3, 4.3, 61.8, 18.3];

  barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
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

  barChartLabels1: Label[] = ['Boško Bošković', 'ACME Ltd.', 'Marko Markić', 'Dobra Tvrtka d.o.o.', 'Ivana Ivić', 'Ana Anić'];
  barChartLabels2: Label[] = ['Petar Petrović', 'Franjo Franjić', 'Nina Ninić', 'ACME Ltd. (UK)', 'Luka Lukač', 'Ana Anić'];

  barChartColors1 = 'rgba(0,255,0,0.3)'
  barChartColors2 = 'rgba(255,0,0,0.3)'

  barChartData1: ChartDataSets[] = [
    { data: [21000, 60000, 24000, 77000, 11000, 44000], label: 'Uplate' }
  ];
  barChartData2: ChartDataSets[] = [
    { data: [21000, 60000, 24000, 77000, 11000, 44000], label: 'Isplate' }
  ];

  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  ngOnInit(): void {}
}
