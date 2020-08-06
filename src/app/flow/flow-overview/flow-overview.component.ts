import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-flow-overview',
  templateUrl: './flow-overview.component.html',
  styleUrls: ['./flow-overview.component.scss']
})

export class FlowOverviewComponent implements OnInit {
  moduleName: string = 'Vremenski tijek transakcija';
  moduleFontIcon: string = 'fas fa-clock';
  displayType: string = 'flow'

  constructor() {}

  ngOnInit(): void {}

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
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [pluginDataLabels];

  barChartLabels: Label[] = ['2019-01', '2019-02', '2019-03', '2019-04', '2019-05', '2019-06', '2019-07', '2019-08', '2019-09', '2019-10', '2019-11', '2019-12'];

  barChartColors1 = 'rgba(0,255,0,0.3)'
  barChartColors2 = 'rgba(255,0,0,0.3)'

  barChartData1: ChartDataSets[] = [
    { data: [21000, 60000, 24000, 77000, 11000, 44000, 21000, 60000, 24000, 77000, 11000, 44000], label: 'Uplate' }
  ];
  barChartData2: ChartDataSets[] = [
    { data: [-21000, -11000, -60000, -44000, -24000, -77000, -11000, -21000, -24000, -77000, -60000, -44000], label: 'Isplate' }
  ];

  // events
  chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  addUser() {
    console.log('Flow', 'addUser')
  }
  expandView() {
    console.log('Flow', 'expandViewAction')
  }
  contractView() {
    console.log('Flow', 'contractViewAction')
  }
  notifications() {
    console.log('Flow', 'notificationsAction')
  }
  filter() {
    console.log('Flow', 'filtersAction')
  }
  export() {
    console.log('Flow', 'exportAction')
  }
}
