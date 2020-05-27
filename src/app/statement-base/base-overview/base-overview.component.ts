import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { OVERVIEW_COLUMNS } from '../mock-data/base-overview-columns';
import { BaseService } from '../services/base.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ModalAddPersonComponent } from '../modal-add-person/modal-add-person.component';
import { IBaseItem } from '../models/base-item';

@Component({
  selector: 'app-base-overview',
  templateUrl: './base-overview.component.html',
  styleUrls: ['./base-overview.component.scss']
})
export class BaseOverviewComponent implements OnInit, OnDestroy {

  @ViewChild('myTable') table: any;
  
  columns: any[] = OVERVIEW_COLUMNS;
  isLoading: boolean = true;
  baseItems: IBaseItem[] = [];

  constructor(
    private baseService: BaseService,
    private ngbModalService: NgbModal,
    private toastr: ToastrService
  ) { }

  ngOnDestroy(): void { }

  ngOnInit(): void {
    this.getBaseItems();
  }

  getBaseItems(): void {
    this.baseService.getBaseItems().pipe(untilComponentDestroyed(this)).subscribe(
      data => {
        this.baseItems = data;
        this.isLoading = false;
      }
    )
  }

  onDetailToggle(event): void {
    console.log(event);
  }

  addPersonToBase() {
    const modalRef = this.ngbModalService.open(ModalAddPersonComponent, { backdrop: 'static', keyboard: false });
    modalRef.result.then((result) => {
      if (result) {
        this.toastr.success('Dodana je osoba na predmet!', 'Uspjeh', {
          progressBar: true
        })
      } else {
        this.toastr.warning('Nije dodana osoba na predmet', 'Pažnja', {
          progressBar: true
        })
      }
    }).catch((res) => { });
  }

  editPerson(row: IBaseItem) {
    if(row && row.Osoba) {
      console.log(row.Osoba)
      const modalRef = this.ngbModalService.open(ModalAddPersonComponent, { backdrop: 'static', keyboard: false });
      modalRef.componentInstance.person = row.Osoba;
      modalRef.result.then((result) => {
        if (result) {
          this.toastr.success('Dodana je osoba na predmet!', 'Uspjeh', {
            progressBar: true
          })
        } else {
          this.toastr.warning('Nije dodana osoba na predmet', 'Pažnja', {
            progressBar: true
          })
        }
      }).catch((res) => { });
    }
  }

  deletePerson(row) {
    console.log(row)
  }

  toggleExpandRow(row): void {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }
}
