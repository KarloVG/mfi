import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-table-overview',
  templateUrl: './table-overview.component.html',
  styleUrls: ['./table-overview.component.scss']
})
export class TableOverviewComponent implements OnInit {

  tableItems: IInnerBaseDetail[] = [];
  staticValue: IInnerBaseDetail[] = [];
  isLoading: boolean = true;
  filterValue: string;
  isActiveFilter: boolean = false;
  modalFilterValues: IFilterCriteria;

  constructor(
    private baseDetailService: BaseDetailService,
    private ngbModalService: NgbModal,
    private toastr: ToastrService,
    private excelService: ExcelService,
    private localStorageFilterService: LocalStoreFilterService
  ) { }

  ngOnInit(): void {
    this.getTableItems();
    this.hasActiveFilter();
  }

  getTableItems(): void {
    this.baseDetailService.getBaseDetailById().pipe(take(1)).subscribe(
      data => { this.tableItems = data; this.isLoading = false; this.staticValue = data; }
    )
  }

  filterUserTable(): void {
    let searchVal = this.filterValue.toLowerCase()
    let keys = Object.keys(this.tableItems[0]);
    let colsAmt = keys.length + 1;
    this.tableItems = this.staticValue.filter(function (item) {
      console.log()
      for (let i = 0; i < colsAmt; i++) {
        if (item[keys[i]] != null && item[keys[i]].toString().toLowerCase().indexOf(searchVal) !== -1 || !searchVal) {
          return true;
        }
      }
    });
  }

  removeFilter(): void {
    this.filterValue = '';
    this.tableItems = this.staticValue;
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
    if(this.localStorageFilterService.hasToken()) {
      this.modalFilterValues = JSON.parse(localStorage['filter_fields']);
      this.isActiveFilter = true;
    } else {
      this.modalFilterValues = null;
      this.isActiveFilter = false;  
    }
  }

  exportAsXLSX(): void {

    if (this.tableItems && this.tableItems.length > 0) {
      let excelRows = [];
      let columnWidth = [];
      this.tableItems.forEach(row => {
        excelRows.push({
          'Broj računa A': row.BrojRacunaA,
          'SWIFT A': row.SWIFTA,
          'Banka A': row.BankaA,
          'Država': row.DrzavaA,
          'NazivA': row.NazivA,
          'Datum transakcije': new DateOnlyPipe('en-US').transform(row.DatumTransakcije),
          'Referentni broj': row.ReferentniBroj,
          'Vrsta transakcije': row.VrstaTransakcije,
          'Valuta': row.Valuta,
          'Cijena u kn': row.CijenaKn,
          'Smjer': row.Smjer,
          'Broj računa B': row.BrojRacunaB,
          'SWIFT B': row.SWIFTB,
          'Banka B': row.BankaB,
          'Država B': row.DrzavaB,
          'Naziv B': row.NazivB
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

}
