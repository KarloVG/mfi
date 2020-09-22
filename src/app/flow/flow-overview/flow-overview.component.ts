import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ITimespanChoice } from '../models/timespan-choice';
import { FlowService } from '../services/flow.service';
import { NgbDateParserFormatter, NgbDatepickerI18n, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from 'src/app/shared/utils/ngb-date-custom-parser-formatter';
import { CustomDatepickerI18n } from 'src/app/shared/utils/custom-date-picker-i18n';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { BaseToBlobService } from 'src/app/shared/services/base-to-blob-service';
import { NgxCaptureService } from 'ngx-capture';
import { ToastrService } from 'ngx-toastr';
import { CanComponentDeactivate } from 'src/app/shared/services/confirm-exit-popup-guard';
import { Observable, Subject } from 'rxjs';
import { ModalSaveStateComponent } from 'src/app/shared/components/modal-save-state/modal-save-state.component';
import { SaveStateService } from 'src/app/shared/services/save-state.service';
import { take } from 'rxjs/operators';
import { ISaveStateResponse } from 'src/app/shared/models/save-state-response';
import { SaveStateDeterminator } from 'src/app/shared/services/save-state-determinator';

@Component({
  selector: 'app-flow-overview',
  templateUrl: './flow-overview.component.html',
  styleUrls: ['./flow-overview.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }
  ]
})

export class FlowOverviewComponent implements OnInit, CanComponentDeactivate {
  moduleName: string = 'Vremenski tijek transakcija';
  moduleFontIcon: string = 'fas fa-clock';

  // flow group
  flowFormGroup: FormGroup = this.formBuilder.group({
    TimespanChoice: [4, Validators.required],
    DatumOd: [null, Validators.required],
    DatumDo: [null, Validators.required]
  });
  
  @ViewChild('screen', { static: true }) screen: any;

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
  // can deactivate
  private confimationSubject = new Subject<boolean>();
  osobaID: number;
  izvodID: number;
  // save state
  savedState: ISaveStateResponse;
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
  constructor(
    private flowService: FlowService,
    private formBuilder: FormBuilder,
    private baseToBlobService: BaseToBlobService,
    private captureService: NgxCaptureService,
    private toastr: ToastrService,
    private ngbModalService: NgbModal,
    private saveStateService: SaveStateService,
    private saveStateDeterminator: SaveStateDeterminator
  ) { }

  ngOnInit(): void {
    this.saveStateService.getSavedState('tijek').pipe(take(1)).subscribe(
      data => {
        this.savedState = data
        if(this.savedState) {
          const jsonValues = JSON.parse(this.savedState.stanjeDijagrama);
          this.flowFormGroup.patchValue({
            TimespanChoice: jsonValues.timespanChoice,
            DatumOd: new Date(jsonValues.timeFrom),
            DatumDo: new Date(jsonValues.timeTo)
          });
          this.barChartLabelsU = jsonValues.barChartLabelsU;
          this.barChartDataU[0].data = jsonValues.barChartDataU;
          this.barChartLabelsI = jsonValues.barChartLabelsI;
          this.barChartDataI[0].data = jsonValues.barChartDataI;
          this.osobaID = jsonValues.osobaID;
          this.izvodID = jsonValues.izvodID;
          this.saveStateDeterminator.changeOsobaOrIzvod({osobaID: this.osobaID, izvodID: this.izvodID})
        }
      }
    )
  }

  passOsobaAndIzvodToChild = (args: any): void => {
    const params = {
      osobaID: this.osobaID, 
      izvodID: this.izvodID
    }
  }

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
        this.osobaID = event.osobaID;
        this.izvodID = event.izvodID;
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
            if(data.labeleU.length == 0 && data.iznosiU.length == 0 && data.labeleI.length == 0 && data.iznosiI.length == 0) {
              this.toastr.warning('Ne postoje rezultati prema zadanim parametrima pretrage', 'Pažnja', {
                progressBar: true
              });
            }
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

  exportPicture(event) {
    if(event) {
      this.captureService.getImage(this.screen.nativeElement, true).then(img => {
        const replaceValue = img.replace('data:image/png;base64,', '');
        const convertedFile = this.baseToBlobService.base64toBlob(replaceValue);
        const url= URL.createObjectURL(convertedFile);
        window.open(url, '_blank');
      });
    }
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    console.log(this.barChartLabelsU.length, this.barChartDataU[0].data.length,this.barChartLabelsI.length, this.barChartDataI[0].data.length)
    if(this.barChartLabelsU.length || this.barChartDataU[0].data.length ||this.barChartLabelsI.length || this.barChartDataI[0].data.length)
    {
      const modalRef = this.ngbModalService.open(ModalSaveStateComponent, { backdrop: 'static', keyboard: false });
      modalRef.componentInstance.componentName = 'tijeka';
      modalRef.result.then((result) => {
        if (result == true) {
          //pospremi api
          const requestData = JSON.stringify({
            osobaID: this.osobaID,
            izvodID: this.izvodID,
            timespanChoice: this.TimespanChoice.value,
            timeFrom: this.DatumOd.value,
            timeTo: this.DatumDo.value,
            barChartLabelsU: this.barChartLabelsU,
            barChartDataU: this.barChartDataU[0].data,
            barChartLabelsI: this.barChartLabelsI,
            barChartDataI: this.barChartDataI[0].data
          });
          this.saveStateService.saveState(requestData, 'tijek').pipe(take(1)).subscribe();
          this.confimationSubject.next(true);
        } else if (result == false) {
          //nemoj pospremiti
          this.toastr.warning('Stanje predmeta nije pohranjeno', 'Pažnja', {
            progressBar: true
          });
          this.confimationSubject.next(true);
        } else {
          this.confimationSubject.next(false);
        }
      });
      return this.confimationSubject;
    } else {
      return true;
    } 
  }

  onChangeDate() {
    console.log('changed date')
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
