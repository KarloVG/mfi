import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import { ITimespanChoice } from '../models/timespan-choice';
import { FlowService } from '../services/flow.service';
import { IOsobaDropdown } from 'src/app/statement-base/models/osoba-dropdown';

@Component({
  selector: 'app-flow-overview',
  templateUrl: './flow-overview.component.html',
  styleUrls: ['./flow-overview.component.scss']
})

export class FlowOverviewComponent implements OnInit {
  moduleName: string = 'Vremenski tijek transakcija';
  moduleFontIcon: string = 'fas fa-clock';

  // basic graph vars
  displayType: string = 'flow'

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
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [pluginDataLabels];
  chartColors: Array<any> = [
    {
      backgroundColor: ['#d13537', '#b000b5']
    }
  ];

  //timespan vars
  private dynamicDate = new Date();
  dynamicToday = {
    year: this.dynamicDate.getFullYear(),
    month: this.dynamicDate.getMonth() + 1,
    day: this.dynamicDate.getDate()
  }
  timespanChoice: number = 4;
  timespanChoices: ITimespanChoice[] = [
    {
      id: 1,
      name: '1 sat',
      inputName:"1sat"
    },
    {
      id: 2,
      name: '1 dan',
      inputName:"1dan"
    },
    {
      id: 3,
      name: '1 tjedan',
      inputName:"1tjedan"
    },
    {
      id: 4,
      name: '1 mjesec',
      inputName:"1mjesec"
    },
    {
      id: 5,
      name: '1 godina',
      inputName:"1godina"
    }
  ];
  selectedTimespan: number;
  choosenDate: any;
  dates: any[];

  // graph label
  barChartLabels: Label[] = ['2019-01', '2019-02', '2019-03', '2019-04', '2019-05', '2019-06', '2019-07', '2019-08', '2019-09', '2019-10', '2019-11', '2019-12'];

  // uplate
  barChartDataU: ChartDataSets[] = [{ data: [], label: 'Uplate' }];
  barChartDataUx: ChartDataSets[] = [
    { data: [21000, 60000, 24000, 77000, 11000, 44000, 21000, 60000, 24000, 77000, 11000, 44000], label: 'Uplate' }
  ];

  // isplate
  barChartDataI: ChartDataSets[] = [{ data: [], label: 'Isplate' }];
  barChartDataIx: ChartDataSets[] = [
    { data: [-21000, -11000, -60000, -44000, -24000, -77000, -11000, -21000, -24000, -77000, -60000, -44000], label: 'Isplate' }
  ];

  //app visualisation event emitterr

  entriesMin: number = 1
  entriesMax: number = 90

  constructor(
    private flowService: FlowService
  ) {}

  ngOnInit(): void {}

  chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  // output from child component
  onChangeOsobaOrIzvod(event) {
    if(event.osobaID && event.izvodID) {
      this.flowService.getGraphData(event.osobaID, event.izvodID, this.timespanChoice).subscribe(
        data => { 
          console.log(data);
          // this.barChartDataU[0].data.push(this.rndmm(this.entriesMin, this.entriesMax) * 1000)
          // this.barChartDataI[0].data.push(-1 * this.rndmm(this.entriesMin, this.entriesMax) * 1000)
        }
      );
    }
  }

  onSelectTimespan() {

  }
  
  onChangeDate () {

  }

  changeGraphTimespan(timespan: number) {
    this.selectedTimespan = null;
    if(this.timespanChoice) {
      if(this.timespanChoice == 1) {

      } else if(this.timespanChoice == 2) {

      } else if(this.timespanChoice == 3) {
        
      } else if(this.timespanChoice == 4) {
        
      } else if(this.timespanChoice == 5) {
        
      }
    }
    // this.flowService.getGraphData()
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

  rndmm(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}
