import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IInnerbaseItem } from '../../models/inner-base-item';
import { IInnerBaseDetail } from '../../models/inner-base-detail';
import { BaseDetailService } from '../../services/base-detail.service';
import { take } from 'rxjs/operators';
import { BasePaginationComponent } from 'src/app/shared/components/base-pagination/base-pagination.component';
import { IFinancijskaTransakcija } from 'src/app/shared/models/financijska-transakcija';
import { IPagedResult } from 'src/app/shared/models/pagination/paged-result';
import { IPaginationBase } from 'src/app/shared/models/pagination/pagination-base';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-modal-base-detail',
  templateUrl: './modal-base-detail.component.html',
  styleUrls: ['./modal-base-detail.component.scss']
})
export class ModalBaseDetailComponent extends BasePaginationComponent implements OnInit, OnDestroy {

  @Input() izvod: IInnerbaseItem;
  @Input() listaIzvodID: number[];
  @Input() isMap: boolean = false;
  @Input() isDiagram: boolean = false
  @Input() brojRacuna: string;
  @Input() drzava: string;
  @Input() isARN: boolean = false
  isLoading: boolean = true;
  //baseTransactions: IInnerBaseDetail[] = [];
  // ugly, but works; nije mi se dalo kopati po tome dublje
  baseTransactions: any = [];

  // pagination
  readonly pageSize = 10;
  pagedResult: IPagedResult<IFinancijskaTransakcija>;
  paginationRequest: IPaginationBase;
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  constructor(
    private modal: NgbActiveModal,
    private baseDetailService: BaseDetailService
  ) {
    super()
  }

  ngOnDestroy() {}

  ngOnInit(): void {
    this.paginationRequest = {
      page: this.currentPage + 1,
      pageSize: this.pageSize
    };
    this.fetchPage();
  }

  removeFilter(): void {
    this.paginationRequest.searchString = '';
    this.paginationRequest.page = 1;
    this.fetchPage();
  }

  fetchPage() {
    if(this.isMap) {
      this.baseDetailService.getBaseDetailForMap(this.paginationRequest,this.listaIzvodID, this.drzava).pipe(
        untilComponentDestroyed(this)).subscribe(pagedResult => {
          this.isLoading = false;
          this.pagedResult = pagedResult;
        });
    } else if(this.isDiagram) {
      this.baseDetailService.getBaseDetailForDiagram(this.paginationRequest,this.listaIzvodID, this.brojRacuna, this.isARN).pipe(
        untilComponentDestroyed(this)).subscribe(pagedResult => {
          this.isLoading = false;
          this.pagedResult = pagedResult;
        });
    } else {
      this.baseDetailService.getBaseDetailById(this.paginationRequest,this.izvod.izvodID).pipe(
        untilComponentDestroyed(this)).subscribe(pagedResult => {
          this.isLoading = false;
          this.pagedResult = pagedResult;
        });
    }
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

  exitModal(): void {
    this.modal.dismiss();
  }
}
