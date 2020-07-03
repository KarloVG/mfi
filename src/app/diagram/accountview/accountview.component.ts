import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { DiagramService } from 'src/app/shared/services/diagram.service'

@Component({
  selector: 'app-accountview',
  templateUrl: './accountview.component.html',
  styleUrls: ['./accountview.component.scss']
})
export class AccountviewComponent implements OnInit {
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

  showMoreData: boolean = false

  constructor(private diaSvc: DiagramService) {}
  ngOnInit(): void {
    this.focusAccounts = this.activeUser.accounts
    console.log('NX', this.node)
    console.log('XX', this.activeUser)
    console.log('BX', this.isSelectedActiveUser)
  }

  closeInfobox() {
    this.close.emit(true)
  }

  expandAccountDetails() {
    console.log('Account details', this.node)
    this.showMoreData = !this.showMoreData
  }
}
