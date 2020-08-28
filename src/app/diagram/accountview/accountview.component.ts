import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {DiagramService} from 'src/app/shared/services/diagram.service'
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
//import {ModalAccountviewDetailComponent} from './modal-accountview-detail/modal-accountview-detail.component'
import {ModalBaseDetailComponent} from 'src/app/statement-base/base-overview/modal-base-detail/modal-base-detail.component'

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

  constructor(
    private diaSvc: DiagramService,
    private ngbModalService: NgbModal
    ) {}

  ngOnInit(): void {
    //console.log('INX', this.node, this.activeUser)
    if (this.node.data.hasOwnProperty('iznosTransakcija') && this.node.data.hasOwnProperty('iznosUplata') && !this.node.data.hasOwnProperty('iznosIsplata')) {
      this.node.data.iznosIsplata = this.node.data.iznosTransakcija - this.node.data.iznosUplata
    }
    this.focusAccounts = this.activeUser.accounts
  }

  closeInfobox(): void {
    this.close.emit(true)
  }

  expandAccountDetails(): void {
    /*
    const modalRef = this.ngbModalService.open(ModalAccountviewDetailComponent, { size: 'xl', backdrop: 'static', keyboard: false, windowClass: 'largeModalClass' });
    modalRef.componentInstance.inputUser = this.activeUser
    modalRef.componentInstance.izvod = this.node.data
    */
    const modalRef = this.ngbModalService.open(ModalBaseDetailComponent, { size: 'xl', backdrop: 'static', keyboard: false, windowClass: 'largeModalClass' });
    modalRef.componentInstance.izvod = this.node.data
  }
}
