import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ChartService } from '../services/chart-service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { IChartResponse } from '../models/chart-response';
import { NgxCaptureService } from 'ngx-capture';
import { BaseToBlobService } from 'src/app/shared/services/base-to-blob-service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SaveStateService } from 'src/app/shared/services/save-state.service';
import { SaveStateDeterminator } from 'src/app/shared/services/save-state-determinator';
import { ISaveStateResponse } from 'src/app/shared/models/save-state-response';
import { take } from 'rxjs/operators';
import { CanComponentDeactivate } from 'src/app/shared/services/confirm-exit-popup-guard';
import { Observable, Subject } from 'rxjs';
import { ModalSaveStateComponent } from 'src/app/shared/components/modal-save-state/modal-save-state.component';

@Component({
  selector: 'app-chart-overview',
  templateUrl: './chart-overview.component.html',
  styleUrls: ['./chart-overview.component.scss']
})

export class ChartOverviewComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  
  moduleName: string = 'Graf financijskih transakcija';
  moduleFontIcon: string = 'fas fa-chart-pie';
  displayType: string = 'chart';
  // save state
  savedState: ISaveStateResponse;
  private confimationSubject = new Subject<boolean>();
  chartResponseData: IChartResponse;
  osobaID: number;
  izvodID: number;

  constructor(
    private chartService: ChartService,
    private captureService: NgxCaptureService,
    private baseToBlobService: BaseToBlobService,
    private toastr: ToastrService,
    private ngbModalService: NgbModal,
    private saveStateService: SaveStateService,
    private saveStateDeterminator: SaveStateDeterminator
  ) { }

  @ViewChild('screen', { static: true }) screen: any;
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
      this.osobaID = event.osobaID;
      this.izvodID = event.izvodID;
      this.chartService.getChartData(event.osobaID, event.izvodID).pipe(untilComponentDestroyed(this)).subscribe(
        data => {
          this.chartResponseData = data;
          if(this.chartResponseData.ulazneOsobeData && this.chartResponseData.ulazneOsobeLabels) {
            this.barChartLabelsU = this.chartResponseData.ulazneOsobeLabels;
            this.barChartDataU[0].data = this.chartResponseData.ulazneOsobeData;
            this.chartResponseData.ulazneOsobeData.forEach(
              item => {
                this.zbrojUplata += item;
              }
            );
          }
          if(this.chartResponseData.izlazneOsobeData && this.chartResponseData.izlazneOsobeLabels) {
            this.barChartLabelsI = this.chartResponseData.izlazneOsobeLabels;
            this.barChartDataI[0].data = this.chartResponseData.izlazneOsobeData;
            this.chartResponseData.izlazneOsobeData.forEach(
              item => {
                this.zbrojIsplata += item;
              }
            );
          }
          if(this.chartResponseData.izlazneDrzaveData && this.chartResponseData.izlazneDrzaveLabels) {
            this.pieChartLabelsI = this.chartResponseData.izlazneDrzaveLabels;
            this.pieChartDataI = this.chartResponseData.izlazneDrzaveData;
          }
          if(this.chartResponseData.ulazneDrzaveData && this.chartResponseData.ulazneDrzaveLabels) {
            this.pieChartLabelsU = this.chartResponseData.ulazneDrzaveLabels;
            this.pieChartDataU = this.chartResponseData.ulazneDrzaveData;
          }
          if(this.chartResponseData.ulazneOsobeLabels.length == 0 &&
            this.chartResponseData.ulazneOsobeData.length == 0 &&
            this.chartResponseData.izlazneOsobeLabels.length == 0 &&
            this.chartResponseData.izlazneOsobeData.length == 0 &&
            this.chartResponseData.ulazneDrzaveLabels.length == 0 &&
            this.chartResponseData.ulazneDrzaveData.length == 0 &&
            this.chartResponseData.izlazneDrzaveLabels.length == 0 &&
            this.chartResponseData.izlazneDrzaveData.length == 0) {
              this.toastr.warning('Ne postoje rezultati prema zadanim parametrima pretrage', 'Pažnja', {
                progressBar: true
              });
            }
        }
      )
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

  chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  ngOnInit(): void {
    this.saveStateService.getSavedState('graf').pipe(take(1)).subscribe(
      data => {
        this.savedState = data
        if(this.savedState) {
          const jsonValues = JSON.parse(this.savedState.stanjeDijagrama);
          this.barChartLabelsU = jsonValues.barChartLabelsU;
          this.barChartDataU[0].data = jsonValues.barChartDataU;
          this.barChartLabelsI = jsonValues.barChartLabelsI;
          this.barChartDataI[0].data = jsonValues.barChartDataI;
          this.pieChartLabelsI = jsonValues.pieChartLabelsI;
          this.pieChartDataI = jsonValues.pieChartDataI;
          this.pieChartLabelsU = jsonValues.pieChartLabelsU;
          this.pieChartDataU = jsonValues.pieChartDataU;
          this.osobaID = jsonValues.osobaID;
          this.izvodID = jsonValues.izvodID;
          this.zbrojUplata = jsonValues.zbrojUplata;
          this.zbrojIsplata = jsonValues.zbrojIsplata;
          this.saveStateDeterminator.changeOsobaOrIzvod({osobaID: this.osobaID, izvodID: this.izvodID})
        }
      }
    )
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if(this.barChartLabelsU.length || this.barChartDataU[0].data.length ||this.barChartLabelsI.length || this.barChartDataI[0].data.length
      || this.pieChartLabelsI.length || this.pieChartLabelsU.length || this.pieChartDataI.length || this.pieChartDataU.length)
    {
      const modalRef = this.ngbModalService.open(ModalSaveStateComponent, { backdrop: 'static', keyboard: false });
      modalRef.componentInstance.componentName = 'graf';
      modalRef.result.then((result) => {
        if (result == true) {
          //pospremi api
          const requestData = JSON.stringify({
            osobaID: this.osobaID,
            izvodID: this.izvodID,
            barChartLabelsU: this.barChartLabelsU,
            barChartDataU: this.barChartDataU[0].data,
            barChartLabelsI: this.barChartLabelsI,
            barChartDataI: this.barChartDataI[0].data,
            pieChartLabelsI: this.pieChartLabelsI,
            pieChartDataI: this.pieChartDataI,
            pieChartLabelsU: this.pieChartLabelsU,
            pieChartDataU: this.pieChartDataU,
            zbrojUplata: this.zbrojUplata,
            zbrojIsplata: this.zbrojIsplata
          });
          this.saveStateService.saveState(requestData, 'graf').pipe(take(1)).subscribe();
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
