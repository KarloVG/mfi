import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BaseDetailService } from 'src/app/statement-base/services/base-detail.service';
import { IInnerBaseDetail } from 'src/app/statement-base/models/inner-base-detail';
import { take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalFilterComponent } from 'src/app/shared/components/modal-filter/modal-filter.component';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from 'src/app/shared/services/fake-excel.service';
import { DateOnlyPipe } from 'src/app/shared/utils/date-pipe';
import { LocalStoreFilterService } from 'src/app/shared/services/local-store-filter.service';
import { IFilterCriteria } from 'src/app/shared/models/filter-criteria';
import { BaseService } from 'src/app/statement-base/services/base.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { ITablicaIzvod } from '../models/tablica-izvod';
import { IFinancijskaTransakcija } from 'src/app/shared/models/financijska-transakcija';
import { TableService } from '../services/table.service';
import { IPagedResult } from 'src/app/shared/models/pagination/paged-result';
import { BasePaginationComponent } from 'src/app/shared/components/base-pagination/base-pagination.component';
import { IPaginationBase } from 'src/app/shared/models/pagination/pagination-base';
import { SelectionType, DatatableComponent } from '@swimlane/ngx-datatable';
import { ITopbarTableInfo } from '../models/topbar-table-info';
import { AlarmService } from 'src/app/shared/services/alarm.service';
import { IAlarmResponse } from 'src/app/shared/models/alarm-response';

@Component({
  selector: 'app-table-overview',
  templateUrl: './table-overview.component.html',
  styleUrls: ['./table-overview.component.scss']
})
export class TableOverviewComponent extends BasePaginationComponent implements OnInit, OnDestroy {

  isActiveFilter: boolean = false;
  modalFilterValues: IFilterCriteria;
  moduleName: string = 'Tablica financijskih transakcija';
  moduleFontIcon: string = 'fas fa-table';
  displayType: string = 'table'
  topTableBarInfo: ITopbarTableInfo;
  financijskeTransakcije: IFinancijskaTransakcija[] = [];

  //selection
  SelectionType = SelectionType;
  selected = [];
  initialSelection = [];
  isSelectActive: boolean = false;

  //alarm
  isAlarmActive: boolean = false;
  alarmItems: IAlarmResponse[];

  // pagination
  readonly pageSize = 10;
  pagedResult: IPagedResult<IFinancijskaTransakcija>;
  paginationRequest: IPaginationBase;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  constructor(
    private ngbModalService: NgbModal,
    private toastr: ToastrService,
    private excelService: ExcelService,
    private localStorageFilterService: LocalStoreFilterService,
    private tableService: TableService,
    private alarmService: AlarmService
  ) {
    super();
  }

  ngOnInit(): void {
    this.paginationRequest = {
      page: this.currentPage + 1,
      pageSize: this.pageSize
    };
    this.getTopbarTableInfo();
    this.hasActiveFilter();
    this.fetchPage();
  }

  ngOnDestroy() { }

  getTopbarTableInfo() {
    this.tableService.getTopInfoByPredmetId().pipe(take(1)).subscribe(
      data => {
        this.topTableBarInfo = data;
      }
    )
  }
  /* 
    pagination methods
  */
  fetchPage() {
    this.tableService.getTransakcijeFromIzvod(this.paginationRequest).pipe(
      untilComponentDestroyed(this)).subscribe(pagedResult => {
        this.isLoading = false;
        this.pagedResult = pagedResult;
        if (this.isAlarmActive) {
          this.getAlarmInfo();
        }
      });
  }

  setPage(pageInfo) {
    this.isLoading = true;
    this.setPaginationOption(+pageInfo.offset);
    this.fetchPage();
  }

  onSort(event) {
    this.isLoading = true;
    const orderByValue = event.newValue === 'asc' ? event.column.prop : `-${event.column.prop}`;
    this.paginationRequest.orderBy = orderByValue;
    this.table.bodyComponent.updateOffsetY(this.currentPage);
    this.table.offset = this.currentPage;
    this.fetchPage();
  }

  setPaginationOption(page: number, pageSize?: number) {
    this.currentPage = page;
    this.paginationRequest.page = page + 1;

    if (pageSize) {
      this.paginationRequest.pageSize = pageSize;
    }
  }

  activateAlarm(): void {
    this.selected = [];
    this.initialSelection = [];
    this.isAlarmActive = !this.isAlarmActive;
    if (this.isAlarmActive) {
      this.getAlarmInfo();
    }
  }

  getAlarmInfo() {
    this.alarmService.getAlarmInformation().pipe(take(1)).subscribe(
      data => {
        if (data && data.length) {
          this.alarmItems = data;
          console.log(data);
          if (this.pagedResult && this.pagedResult.model) {
            this.alarmItems.forEach(
              element => {
                const alarmSelectedItems = this.pagedResult.model.filter(x => x.a_RN == element.drugiARN);
                if (alarmSelectedItems && alarmSelectedItems.length) {
                  this.selected = alarmSelectedItems;
                  this.initialSelection = alarmSelectedItems;
                }
              }
            )
          }
        }
      }
    )
  }

  /* 
    component methods
  */

  checkSelectable(row, column, value) {
    this.selected = [...this.initialSelection];
  }

  removeFilter(): void {
    this.paginationRequest.searchString = '';
    this.paginationRequest.page = 1;
    this.fetchPage();
  }

  openFilterModal() {
    const modalRef = this.ngbModalService.open(ModalFilterComponent, { size: 'xl', backdrop: 'static', keyboard: false });
    modalRef.result.then((result) => {
      if (result) {
        this.toastr.success('Polja filtera spremljena', 'Uspjeh', {
          progressBar: true
        })
        this.isActiveFilter = true;
        this.paginationRequest.page = 1;
        this.fetchPage();
      } else if (result == false) {
        this.toastr.warning('Polja filtera su obrisana', 'Pažnja', {
          progressBar: true
        });
        this.isActiveFilter = false;
        this.paginationRequest.page = 1;
        this.fetchPage();
      } else {
        this.toastr.warning('Polja filtera nisu spremljena/uređena', 'Pažnja', {
          progressBar: true
        })
      }
      this.hasActiveFilter();
    });
  }

  hasActiveFilter() {
    console.log('hAFx', this.localStorageFilterService.hasToken())
    if (this.localStorageFilterService.hasToken()) {
      this.modalFilterValues = JSON.parse(localStorage['filter_fields']);
      this.isActiveFilter = true;
    } else {
      this.modalFilterValues = null;
      this.isActiveFilter = false;
    }
  }

  exportAsXLSX(): void {
    this.tableService.getAllTransakcije().pipe(take(1)).subscribe(
      data => {
        if (data && data.length > 0) {
          console.log(data)
          let excelRows = [];
          let columnWidth = [];
          data.forEach(row => {
            excelRows.push({
              'Broj računa A': row.a_RN,
              'SWIFT A': row.a_FIS,
              'Banka A': row.a_FIN,
              'Država': row.a_FID,
              'Naziv A': row.a_NA,
              'Datum transakcije': row.t_DV,
              'Referentni broj': row.t_REF,
              'Vrsta transakcije': row.t_VR,
              'Valuta': row.t_VL,
              'Cijena u kn': row.t_KONV_IZ,
              'Smjer': row.t_DIR,
              'Broj računa B': row.b_RN,
              'SWIFT B': row.a_FIS,
              'Banka B': row.a_FIN,
              'Država B': row.a_FID,
              'Naziv B': row.b_NA
            });

            columnWidth.push(
              { wch: 50 },//A
              { wch: 15 },//B
              { wch: 15 },//C
              { wch: 10 },//D
              { wch: 25 },//E
              { wch: 20 },//F
              { wch: 15 },//G
              { wch: 20 },//H
              { wch: 15 },//I
              { wch: 15 },//J
              { wch: 15 },//K
              { wch: 50 },//L
              { wch: 15 },//M
              { wch: 15 },//N
              { wch: 10 },//O
              { wch: 25 },//P
            )
          })
          this.excelService.exportAsExcelFile(excelRows, 'popis_A_liste', columnWidth);
        } else {
          this.toastr.error('Morate imati barem 1 redak u tablici kako bi se excel mogao popuniti!', 'Pogreška!', {
            progressBar: true,
            timeOut: 6000
          });
        }
      }
    );
  }
}
