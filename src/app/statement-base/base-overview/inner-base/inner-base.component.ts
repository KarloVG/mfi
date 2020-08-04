import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { IInnerbaseItem } from '../../models/inner-base-item';
import { EXPANDED_COLUMNS } from '../../mock-data/base-overview-columns';
import { InnerBaseService } from '../../services/inner-base.service';
import { take } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { ToastrService } from 'ngx-toastr';
import { ModalBaseDetailComponent } from '../modal-base-detail/modal-base-detail.component';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-inner-base',
  templateUrl: './inner-base.component.html',
  styleUrls: ['./inner-base.component.scss']
})
export class InnerBaseComponent implements OnInit, OnDestroy {

  @Input() baseItemID: number;
  isLoading: boolean = true;
  innerItems: IInnerbaseItem[] = [];
  columns: any[] = EXPANDED_COLUMNS;

  constructor(
    private innerService: InnerBaseService,
    private ngbModalService: NgbModal,
    private toastr: ToastrService
  ) { }

  ngOnDestroy(): void { }

  ngOnInit(): void {
    if (this.baseItemID) {
      this.getInnerItemsById();
    }
  }

  getInnerItemsById() {
    this.innerService.getInnerBaseItemsById(this.baseItemID).pipe(take(1)).subscribe(
      data => {
        this.isLoading = false;
        this.innerItems = data;
        console.log('gIBIDx', data)
      }
    );
  }

  deleteInnerBaseItem(row: IInnerbaseItem): void {
    if (row) {
      const modalRef = this.ngbModalService.open(ConfirmationModalComponent, { backdrop: 'static', keyboard: false });
      modalRef.componentInstance.title = 'Uklanjanje detalja izvoda';
      modalRef.componentInstance.description = `Odabrani detalj izvoda sa brojem računa "${row.BrojRacuna}" će biti obrisan za osobu ${row.Naziv}`;
      modalRef.componentInstance.class = true; // text danger
      modalRef.result.then((result) => {
        if (result) {
          this.innerService.deleteInnerBaseItem(row.id).pipe(untilComponentDestroyed(this)).subscribe(
            data => {
              console.log('usao',data)
              this.getInnerItemsById();
              this.toastr.success('Detalj izvoda je obrisan', 'Uspjeh', {
                progressBar: true
              });
            },
            error => {  console.error('dIBIe', error)  }
          )
        } else {
          this.toastr.warning('Detalj izvoda nije obrisan', 'Pažnja', {
            progressBar: true
          });
        }
      }).catch((res) => { });
    }
  }

  showInnerBaseDetail(row: IInnerbaseItem): void {
      const modalRef = this.ngbModalService.open(ModalBaseDetailComponent, { size: 'xl', backdrop: 'static', keyboard: false, windowClass: 'largeModalClass' });
      modalRef.componentInstance.baseDetail = row;
  }

}
