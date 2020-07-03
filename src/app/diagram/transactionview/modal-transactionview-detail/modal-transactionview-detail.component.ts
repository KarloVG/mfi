import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-transactionview-detail',
  templateUrl: './modal-transactionview-detail.component.html',
  styleUrls: ['./modal-transactionview-detail.component.scss']
})
export class ModalTransactionviewDetailComponent implements OnInit {

  @Input() node: any;
  @Input() inputUser: any;
  @Input() outputUser: any;
  isLoading: boolean = true;

  userTransactions: any[] = []

  constructor(
    public modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.userTransactions = this.node.accounts['to'].transactions.transactions;
    this.isLoading = false;
  }

}
