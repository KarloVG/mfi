import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {untilComponentDestroyed} from '@w11k/ngx-componentdestroyed';
import { DiagramService } from 'src/app/shared/services/diagram.service'
import {ModalBaseDetailComponent} from 'src/app/statement-base/base-overview/modal-base-detail/modal-base-detail.component'

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

  areDetailsExpanded: boolean = false

  constructor(
    private diaSvc: DiagramService,
    private ngbModalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.setup()
  }

  ngOnChanges(changes) {
    if (changes.node.firstChange === false && changes.node.currentValue.label !== changes.node.previousValue.label) {
      this.setup()
    }
  }

  setup() {
    this.focusAccounts = this.activeUser.izvodi
    this.accounts = this.isSelectedActiveUser? this.node.data.izvodi : this.linkedAccounts

    this.accounts.forEach(acc => {
      if (acc.hasOwnProperty('iznosTransakcija') && acc.hasOwnProperty('iznosUplata') && !acc.hasOwnProperty('iznosIsplata')) {
        acc.iznosIsplata = acc.iznosTransakcija - acc.iznosUplata
      }
    })

    if (this.accounts.length) {
      this.node.countIn = this.accounts.map(itm => { return itm.brojUplata }).reduce((p, c) => { return p + c })
      this.node.countOut = this.accounts.map(itm => { return itm.brojIsplata }).reduce((p, c) => { return p + c })
      this.node.totalIn = this.diaSvc.getTotals(this.accounts, 'iznosUplata')
      this.node.totalOut = this.diaSvc.getTotals(this.accounts, 'iznosIsplata')
    } else {
      this.node.countIn = null
      this.node.countOut = null
      this.node.totalIn = null
      this.node.totalOut = null
    }
    //console.log('ACX', this.linkedAccounts, this.accounts, this.node)
  }

  expandAccountsInfo() {
    this.areDetailsExpanded = true
  }
  contractAccountsInfo() {
    this.areDetailsExpanded = false
  }

  showAccountInfo(brRacuna) {
    console.log('EEK', brRacuna)
    console.log('DTX', this.node.data.izvodi)
    //const izvod = this.node.data.izvodi.find(itm => { console.log('->', itm); return itm.brojRacuna == brRacuna })
    const izvodi = this.node.data.izvodi.map(itm => { return itm.izvodID })
    console.log('RX', izvodi)
    this.diaSvc.getDiagramAccountDetailList(izvodi, brRacuna).pipe(untilComponentDestroyed(this)).subscribe(
      data => {
        console.log('GDADx', data)
        const modalRef = this.ngbModalService.open(ModalBaseDetailComponent, { size: 'xl', backdrop: 'static', keyboard: false, windowClass: 'largeModalClass' });
        modalRef.componentInstance.izvod = data
      }
    )
  }

  closeInfobox() {
    this.close.emit(true)
  }

  public ngOnDestroy(): void {}
}
