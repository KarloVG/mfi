import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { DiagramService } from 'src/app/shared/services/diagram.service'

@Component({
  selector: 'app-transactionview',
  templateUrl: './transactionview.component.html',
  styleUrls: ['./transactionview.component.scss']
})
export class TransactionviewComponent implements OnInit {
  @Input() node: any
  @Output() close = new EventEmitter<boolean>()

  showMoreData: boolean = false

  constructor(private diaSvc: DiagramService) {}
  ngOnInit(): void {}

  closeInfobox() {
    this.close.emit(true)
  }

  expandTransactionsDetails() {
    this.node.accounts.from.user = this.diaSvc.getPerson(this.node.accounts.from.userId)
    this.node.accounts.to.user = this.diaSvc.getPerson(this.node.accounts.to.userId)
    this.showMoreData = !this.showMoreData
  }
}
