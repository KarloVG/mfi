import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {DiagramService} from 'src/app/shared/services/diagram.service'
import {FinancijskaTransakcijaService} from '../services/financijska-transakcija.service'
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
//import {ModalAccountviewDetailComponent} from './modal-accountview-detail/modal-accountview-detail.component'
import {ModalBaseDetailComponent} from 'src/app/statement-base/base-overview/modal-base-detail/modal-base-detail.component'
import {untilComponentDestroyed} from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-accountview',
  templateUrl: './accountview.component.html',
  styleUrls: ['./accountview.component.scss']
})
export class AccountviewComponent implements OnInit, OnDestroy {
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
    private finTranSvc: FinancijskaTransakcijaService,
    private ngbModalService: NgbModal
  ) {}

  ngOnInit(): void {
    console.log('INX', this.node, this.activeUser)

    /*
    this.finTranSvc.getAccountData(0, 'HR1923600003851226433').pipe(untilComponentDestroyed(this)).subscribe(
      data => {
        console.log('FTX', data)
      }
    )
    */
    if (this.node.type === 'connectedAccount') {
      this.node.data = {
        brojRacuna: this.node.label? this.node.label : this.node.id,
        swift: null,
        banka: null,
        brojIsplata: null,
        brojUplata: null,
        iznosIsplata: null,
        iznosUplata: null,
        brojTransakcija: null,
      }
    }

    if (this.node.data.hasOwnProperty('iznosTransakcija') && this.node.data.hasOwnProperty('iznosUplata') && !this.node.data.hasOwnProperty('iznosIsplata')) {
      this.node.data.iznosIsplata = this.node.data.iznosTransakcija - this.node.data.iznosUplata
    }
    this.focusAccounts = this.activeUser.accounts
  }

  closeInfobox(): void {
    this.close.emit(true)
  }

  expandAccountDetails(): void {
    const modalRef = this.ngbModalService.open(ModalBaseDetailComponent, { size: 'xl', backdrop: 'static', keyboard: false, windowClass: 'largeModalClass' });
    modalRef.componentInstance.izvod = this.node.data
  }

  public ngOnDestroy(): void {}
}
