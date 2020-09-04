import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {DiagramService} from 'src/app/shared/services/diagram.service'
import {FinancijskaTransakcijaService} from '../services/financijska-transakcija.service'
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
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
    this.focusAccounts = this.activeUser.accounts
  }

  closeInfobox(): void {
    this.close.emit(true)
  }

  expandAccountDetails(): void {
    if (this.node.type === 'account') {
      const modalRef = this.ngbModalService.open(ModalBaseDetailComponent, { size: 'xl', backdrop: 'static', keyboard: false, windowClass: 'largeModalClass' });
      modalRef.componentInstance.izvod = this.node.data
    } else if (this.node.type === 'connectedAccount') {
      this.diaSvc.getDiagramAccountDetailList(this.node.listaIzvoda, this.node.data.brojRacuna).pipe(untilComponentDestroyed(this)).subscribe(
        data => {
          //console.log('GIBLx', data)
          const modalRef = this.ngbModalService.open(ModalBaseDetailComponent, { size: 'xl', backdrop: 'static', keyboard: false, windowClass: 'largeModalClass' });
          modalRef.componentInstance.izvod = data
          modalRef.componentInstance.isMap = true
        }
      )
    }
  }

  public ngOnDestroy(): void {}
}
