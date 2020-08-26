import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DiagramService } from 'src/app/shared/services/diagram.service'
import { IInnerbaseItem } from 'src/app/statement-base/models/inner-base-item';
import { IInnerBaseDetail } from 'src/app/statement-base/models/inner-base-detail';
import { BaseDetailService } from 'src/app/statement-base/services/base-detail.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-modal-accountview-detail',
  templateUrl: './modal-accountview-detail.component.html',
  styleUrls: ['./modal-accountview-detail.component.scss']
})
export class ModalAccountviewDetailComponent implements OnInit {
  @Input() izvod: any;
  @Input() inputUser: any;

  isLoading: boolean = true;
  baseTransactions: IInnerBaseDetail[] = []

  constructor(
    private diaSvc: DiagramService,
    public modal: NgbActiveModal,
    private baseDetailService: BaseDetailService
  ) {}

  ngOnInit(): void {
    this.getBaseDetail()
  }

  getBaseDetail() {
    this.baseDetailService.getBaseDetailById(this.izvod.izvodID).pipe(take(1)).subscribe(data => {
      this.baseTransactions = data;
      this.isLoading = false;
      console.log('DDX', this.baseTransactions);
    })
  }

  exitModal(): void {
    this.modal.dismiss();
  }
}
