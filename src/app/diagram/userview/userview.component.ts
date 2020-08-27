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
    this.focusAccounts = this.activeUser.izvodi
    this.accounts = this.isSelectedActiveUser? this.node.data.izvodi : this.linkedAccounts

    console.log('UVX', this.node, this.activeUser)
    this.accounts.forEach(acc => {
      if (acc.hasOwnProperty('iznosTransakcija') && acc.hasOwnProperty('iznosUplata') && !acc.hasOwnProperty('iznosIsplata')) {
        acc.iznosIsplata = acc.iznosTransakcija - acc.iznosUplata
      }
    })

    this.node.countIn = this.accounts.map(itm => { return itm.brojUplata }).reduce((p, c) => { return p + c })
    this.node.countOut = this.accounts.map(itm => { return itm.brojIsplata }).reduce((p, c) => { return p + c })
    this.node.totalIn = this.diaSvc.getTotals(this.accounts, 'iznosUplata')
    this.node.totalOut = this.diaSvc.getTotals(this.accounts, 'iznosIsplata')
    //console.log('ACX', this.linkedAccounts, this.accounts, this.node)
  }

  closeInfobox() {
    this.close.emit(true)
  }
}
