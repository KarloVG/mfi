import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ITimespanChoice } from '../models/timespan-choice';
import { FlowService } from '../services/flow.service';
import { NgbDateParserFormatter, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from 'src/app/shared/utils/ngb-date-custom-parser-formatter';
import { CustomDatepickerI18n } from 'src/app/shared/utils/custom-date-picker-i18n';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-flow-overview',
  templateUrl: './flow-overview.component.html',
  styleUrls: ['./flow-overview.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }
  ]
})

export class FlowOverviewComponent implements OnInit {
  moduleName: string = 'Vremenski tijek transakcija';
  moduleFontIcon: string = 'fas fa-clock';

  // flow group
  flowFormGroup: FormGroup = this.formBuilder.group({
    TimespanChoice: [4, Validators.required],
    DatumOd: [null, Validators.required],
    DatumDo: [null, Validators.required]
  });

  // basic graph vars
  displayType: string = 'flow'
  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          stacked: true,
          ticks: {
            fontColor: 'black',
            fontSize: 13
          },
          gridLines: {
            color: '#5f5e5e'
          }
        }],
      yAxes: [{
        stacked: true,
        ticks: {
          fontColor: 'black',
          fontSize: 15,
          min: 0,
          beginAtZero: true,
        }
      }]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'top'
      }
    }
  };
  barChartLabelsI: Label[] = [];
  barChartLabelsU: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [pluginDataLabels];
  barChartColorU: Color[] = [
    { backgroundColor: 'rgb(250,128,114)' }
  ];
  barChartColorI: Color[] = [
    { backgroundColor: 'rgb(0,191,255)' }
  ];
  // uplate
  barChartDataU: ChartDataSets[] = [{ data: [], label: 'Uplate' }];
  // isplate
  barChartDataI: ChartDataSets[] = [{ data: [], label: 'Isplate' }];

  //timespan vars
  private dynamicDate = new Date();
  dynamicToday = {
    year: this.dynamicDate.getFullYear(),
    month: this.dynamicDate.getMonth() + 1,
    day: this.dynamicDate.getDate()
  }
  timespanChoices: ITimespanChoice[] = [
    {
      id: 1,
      name: '1 sat',
      inputName: "1sat"
    },
    {
      id: 2,
      name: '1 dan',
      inputName: "1dan"
    },
    {
      id: 3,
      name: '1 tjedan',
      inputName: "1tjedan"
    },
    {
      id: 4,
      name: '1 mjesec',
      inputName: "1mjesec"
    },
    {
      id: 5,
      name: '1 godina',
      inputName: "1godina"
    }
  ];

  //app visualisation event emitterr

  entriesMin: number = 1
  entriesMax: number = 90

  constructor(
    private flowService: FlowService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void { }

  chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  // output from child component
  onChangeOsobaOrIzvod(event) {
    if (this.flowFormGroup.valid) {
      if (event.osobaID) {
        this.flowService.getGraphData(event.osobaID, event.izvodID, this.flowFormGroup).subscribe(
          data => {
            this.barChartLabelsU = [];
            this.barChartDataU[0].data = []
            this.barChartLabelsI = [];
            this.barChartDataI[0].data = [];

            this.barChartLabelsU = data.labeleU;
            this.barChartDataU[0].data = data.iznosiU;
            this.barChartLabelsI = data.labeleI;
            this.barChartDataI[0].data = data.iznosiI;
          }
        );
      }
      console.log('validna forma');
    } else {
      console.log('invalidna forma');
      this.flowFormGroup.markAllAsTouched();
      // triggers invalid-feedback class
      return;
    }
  }

  onChangeDate() {
    console.log('changed date')
  }

  changeGraphTimespan(timespan: number) {
    if (timespan == 1) {

    } else if (timespan == 2) {

    } else if (timespan == 3) {

    } else if (timespan == 4) {

    } else if (timespan == 5) {

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

  get TimespanChoice(): AbstractControl {
    return this.flowFormGroup.get('TimespanChoice');
  }
  get DatumOd(): AbstractControl {
    return this.flowFormGroup.get('DatumOd');
  }
  get DatumDo(): AbstractControl {
    return this.flowFormGroup.get('DatumDo');
  }
}
