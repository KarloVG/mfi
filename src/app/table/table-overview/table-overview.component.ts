import { Component, OnInit, OnDestroy } from '@angular/core';
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

@Component({
  selector: 'app-table-overview',
  templateUrl: './table-overview.component.html',
  styleUrls: ['./table-overview.component.scss']
})
export class TableOverviewComponent extends BasePaginationComponent implements OnInit, OnDestroy {

  filterValue: string;
  isActiveFilter: boolean = false;
  modalFilterValues: IFilterCriteria;
  moduleName: string = 'Tablica financijskih transakcija';
  moduleFontIcon: string = 'fas fa-table';
  displayType: string = 'table'

  financijskeTransakcije: IFinancijskaTransakcija[] = [];
  staticValue: IFinancijskaTransakcija[] = [];

  // pagination
  readonly pageSize = 10;
  pagedResult: IPagedResult<IFinancijskaTransakcija>;
  paginationRequest: IPaginationBase;

  constructor(
    private ngbModalService: NgbModal,
    private toastr: ToastrService,
    private excelService: ExcelService,
    private localStorageFilterService: LocalStoreFilterService,
    private tableService: TableService
  ) { 
    super();
  }

  ngOnInit(): void {
    this.paginationRequest = {
      page: this.currentPage + 1,
      pageSize: this.pageSize
    };
    this.hasActiveFilter();
    this.fetchPage();
    // this.getIzvod();
  }

  ngOnDestroy() { }

  /* 
    pagination methods
  */
  fetchPage() {
    console.log('tu')
    this.tableService.getTransakcijeFromIzvod(this.paginationRequest).pipe(
      untilComponentDestroyed(this)).subscribe(pagedResult => {
        this.isLoading = false;
        this.pagedResult = pagedResult;
        console.log(this.pagedResult)
      });
  }

  setPage(pageInfo) {
    this.isLoading = true;
    this.setPaginationOption(+pageInfo.offset);
    this.fetchPage();
  }

  onSort(event) {
    this.isLoading = true;
    const orderByValue = event.newValue === 'asc' ? event.column.name : `-${event.column.name}`;
    this.paginationRequest.orderBy = orderByValue;
    this.fetchPage();
  }

  setPaginationOption(page: number, pageSize?: number) {
    this.currentPage = page;
    this.paginationRequest.page = page + 1;

    if (pageSize) {
      this.paginationRequest.pageSize = pageSize;
    }
  }

  /* 
    component methods
  */

  filterUserTable(): void {
    let searchVal = this.filterValue.toLowerCase()
    let keys = Object.keys(this.financijskeTransakcije[0]);
    let colsAmt = keys.length + 1;
    this.financijskeTransakcije = this.staticValue.filter(function (item) {
      for (let i = 0; i < colsAmt; i++) {
        if (item[keys[i]] != null && item[keys[i]].toString().toLowerCase().indexOf(searchVal) !== -1 || !searchVal) {
          return true;
        }
      }
    });
  }

  removeFilter(): void {
    this.filterValue = '';
    this.financijskeTransakcije = this.staticValue;
  }

  openFilterModal() {
    const modalRef = this.ngbModalService.open(ModalFilterComponent, { size: 'xl', backdrop: 'static', keyboard: false });
    modalRef.result.then((result) => {
      if (result) {
        this.toastr.success('Polja filtera spremljena', 'Uspjeh', {
          progressBar: true
        })
        this.isActiveFilter = true;
      } else if(result == false) {
        this.toastr.warning('Polja filtera su obrisana', 'Pažnja', {
          progressBar: true
        });
        this.isActiveFilter = false;
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
    if(this.localStorageFilterService.hasToken()) {
      this.modalFilterValues = JSON.parse(localStorage['filter_fields']);
      this.isActiveFilter = true;
    } else {
      this.modalFilterValues = null;
      this.isActiveFilter = false;
    }
  }

  exportAsXLSX(): void {
    // if (this.financijskeTransakcije && this.financijskeTransakcije.length > 0) {
    //   let excelRows = [];
    //   let columnWidth = [];
    //   this.financijskeTransakcije.forEach(row => {
    //     excelRows.push({
    //       'Broj računa A': row.BrojRacunaA,
    //       'SWIFT A': row.SWIFTA,
    //       'Banka A': row.BankaA,
    //       'Država': row.DrzavaA,
    //       'NazivA': row.NazivA,
    //       'Datum transakcije': new DateOnlyPipe('en-US').transform(row.DatumTransakcije),
    //       'Referentni broj': row.ReferentniBroj,
    //       'Vrsta transakcije': row.VrstaTransakcije,
    //       'Valuta': row.Valuta,
    //       'Cijena u kn': row.CijenaKn,
    //       'Smjer': row.Smjer,
    //       'Broj računa B': row.BrojRacunaB,
    //       'SWIFT B': row.SWIFTB,
    //       'Banka B': row.BankaB,
    //       'Država B': row.DrzavaB,
    //       'Naziv B': row.NazivB
    //     });

    //     columnWidth.push(
    //       { wch: 50 },//A
    //       { wch: 15 },//B
    //       { wch: 15 },//C
    //       { wch: 10 },//D
    //       { wch: 25 },//E
    //       { wch: 20 },//F
    //       { wch: 15 },//G
    //       { wch: 20 },//H
    //       { wch: 15 },//I
    //       { wch: 15 },//J
    //       { wch: 15 },//K
    //       { wch: 50 },//L
    //       { wch: 15 },//M
    //       { wch: 15 },//N
    //       { wch: 10 },//O
    //       { wch: 25 },//P
    //     )
    //   })
    //   this.excelService.exportAsExcelFile(excelRows, 'popis_A_liste', columnWidth);
    // } else {
    //   this.toastr.error('Morate imati barem 1 redak u tablici kako bi se excel mogao popuniti!', 'Pogreška!', {
    //     progressBar: true,
    //     timeOut: 6000
    //   });
    // }
  }

}
