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
  isLoading: boolean = true;
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
      data => { this.tableItems = data; this.isLoading = false; }
    )
  }

  openFilterModal() {
    const modalRef = this.ngbModalService.open(ModalFilterComponent, { size: 'xl', backdrop: 'static', keyboard: false });
    modalRef.result.then((result) => {
        this.toastr.success('Osoba je dodana na predmet', 'Uspjeh', {
          progressBar: true
        })
    }).catch((res) => { });
  }

}
