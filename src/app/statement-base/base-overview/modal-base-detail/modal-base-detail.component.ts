import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IInnerbaseItem } from '../../models/inner-base-item';
import { IInnerBaseDetail } from '../../models/inner-base-detail';
import { BaseDetailService } from '../../services/base-detail.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-modal-base-detail',
  templateUrl: './modal-base-detail.component.html',
  styleUrls: ['./modal-base-detail.component.scss']
})
export class ModalBaseDetailComponent implements OnInit {

  @Input() baseDetail: IInnerbaseItem;
  isLoading: boolean = true;
  baseTransactions: IInnerBaseDetail[] = [];

  constructor(
    private modal: NgbActiveModal,
    private baseDetailService: BaseDetailService
  ) { }

  ngOnInit(): void {
    this.getBaseDetail();
  }

  getBaseDetail() {
    this.baseDetailService.getBaseDetailById().pipe(take(1)).subscribe(
      data => { this.baseTransactions = data; this.isLoading = false; }
    )
  }

  exitModal(): void {
    this.modal.dismiss();
  }

}
