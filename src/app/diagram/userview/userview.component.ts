import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { DiagramService } from 'src/app/shared/services/diagram.service'

@Component({
  selector: 'app-userview',
  templateUrl: './userview.component.html',
  styleUrls: ['./userview.component.scss']
})
export class UserviewComponent implements OnInit {
  @Input() node: any
  @Input() isSelectedActiveUser: boolean
  @Input() activeUser: any
  @Output() close = new EventEmitter<boolean>()

  focusTransactionCount: any
  focusTransactionAmount: any
  focusAccounts: any[] = []
  linkedInbound: any[] = []
  linkedOutbound: any[] = []
  linkedAccounts: any[] = []

  accounts: any[]

  constructor(private diaSvc: DiagramService) {}
  ngOnInit(): void {
    this.focusAccounts = this.activeUser.accounts
    this.accounts = this.isSelectedActiveUser? this.node.accounts : this.linkedAccounts

    /*
    this.node.accounts.forEach(acc => {
      this.linkedInbound.push(...acc.transactions.transactions.inbound.filter(itm => { return this.focusAccounts.indexOf(itm.dest) > -1 }))
      this.linkedOutbound.push(...acc.transactions.transactions.outbound.filter(itm => { return this.focusAccounts.indexOf(itm.dest) > -1 }))
      if (this.linkedInbound.length > 0 || this.linkedOutbound.length > 0) { this.linkedAccounts.push(acc) }
    })
    this.focusTransactionCount = this.linkedOutbound.length
    this.focusTransactionAmount = this.diaSvc.getTotals(this.linkedOutbound)
    */
    console.log('ACX', this.linkedAccounts, this.accounts)
  }

  closeInfobox() {
    this.close.emit(true)
  }
}
