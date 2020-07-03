import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { DiagramService } from 'src/app/shared/services/diagram.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalTransactionviewDetailComponent } from './modal-transactionview-detail/modal-transactionview-detail.component';

@Component({
  selector: 'app-transactionview',
  templateUrl: './transactionview.component.html',
  styleUrls: ['./transactionview.component.scss']
})
export class TransactionviewComponent implements OnInit {
  @Input() node: any
  @Output() close = new EventEmitter<boolean>()

  showMoreData: boolean = false

  constructor(
    private diaSvc: DiagramService,
    private ngbModalService: NgbModal
    ) {}
  ngOnInit(): void {}

  closeInfobox(): void {
    this.close.emit(true)
  }

  expandTransactionsDetails(): void {
    // this.node.accounts.from.user = this.diaSvc.getPerson(this.node.accounts.from.userId);
    // this.node.accounts.to.user = this.diaSvc.getPerson(this.node.accounts.to.userId);
    // this.showMoreData = !this.showMoreData

    const modalRef = this.ngbModalService.open(ModalTransactionviewDetailComponent, { size: 'xl', backdrop: 'static', keyboard: false, windowClass: 'largeModalClass' });
    modalRef.componentInstance.inputUser = this.node.accounts.to.user = this.diaSvc.getPerson(this.node.accounts.to.userId);
    modalRef.componentInstance.outputUser = this.diaSvc.getPerson(this.node.accounts.from.userId);
    modalRef.componentInstance.node = this.node;
  }
}
