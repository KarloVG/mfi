import { Component, OnInit } from '@angular/core';
import { BaseDetailService } from 'src/app/statement-base/services/base-detail.service';
import { IInnerBaseDetail } from 'src/app/statement-base/models/inner-base-detail';
import { take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalFilterComponent } from 'src/app/shared/components/modal-filter/modal-filter.component';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private baseDetailService: BaseDetailService,
    private ngbModalService: NgbModal,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getTableItems();
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
      if(result) {
        this.toastr.success('Polja filtera spremljena', 'Uspjeh', {
          progressBar: true
        })
      } else {
        this.toastr.warning('Polja filtera nisu spremljena', 'Pažnja', {
          progressBar: true
        })
      }
    }).catch((res) => { });
  }

}
