import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DiagramService } from 'src/app/shared/services/diagram.service'

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
    private diaSvc: DiagramService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.userTransactions = []
    console.log('NODET', this.node)
    let accAInfo = this.node.accounts.from
    let userAInfo = this.diaSvc.getPerson(accAInfo.userId)
    let accBInfo = this.node.accounts.to
    let userBInfo = this.diaSvc.getPerson(accBInfo.userId)

    this.node.accounts.to.transactions.transactions.inbound.forEach(itm => {
      this.userTransactions.push({
        BrojRacunaA: accAInfo.accNo,
        SWIFTA: accAInfo.swift,
        BankaA: accAInfo.bank,
        DrzavaA: accAInfo.country,
        NazivA: userAInfo.name,
        VrstaTransakcije: 'Uplata',
        Opis: itm.transaction,
        IznosTransakcije: itm.amount,
        Smjer: 'U',
        BrojRacunaB: accBInfo.accNo,
        SWIFTB: accBInfo.swift,
        BankaB: accBInfo.bank,
        DrzavaB: accBInfo.country,
        NazivB: userBInfo.name,
      })
    })
    this.node.accounts.to.transactions.transactions.outbound.forEach(itm => {
      this.userTransactions.push({
        BrojRacunaA: accAInfo.accNo,
        SWIFTA: accAInfo.swift,
        BankaA: accAInfo.bank,
        DrzavaA: accAInfo.country,
        NazivA: userAInfo.name,
        VrstaTransakcije: 'Isplata',
        Opis: itm.transaction,
        IznosTransakcije: itm.amount,
        Smjer: 'I',
        BrojRacunaB: accBInfo.accNo,
        SWIFTB: accBInfo.swift,
        BankaB: accBInfo.bank,
        DrzavaB: accBInfo.country,
        NazivB: userBInfo.name,
      })
    })
    this.node.accounts.from.transactions.transactions.inbound.forEach(itm => {
      this.userTransactions.push({
        BrojRacunaA: accAInfo.accNo,
        SWIFTA: accAInfo.swift,
        BankaA: accAInfo.bank,
        DrzavaA: accAInfo.country,
        NazivA: userAInfo.name,
        VrstaTransakcije: 'Uplata',
        Opis: itm.transaction,
        IznosTransakcije: itm.amount,
        Smjer: 'U',
        BrojRacunaB: accBInfo.accNo,
        SWIFTB: accBInfo.swift,
        BankaB: accBInfo.bank,
        DrzavaB: accBInfo.country,
        NazivB: userBInfo.name,
      })
    })
    this.node.accounts.from.transactions.transactions.outbound.forEach(itm => {
      this.userTransactions.push({
        BrojRacunaA: accAInfo.accNo,
        SWIFTA: accAInfo.swift,
        BankaA: accAInfo.bank,
        DrzavaA: accAInfo.country,
        NazivA: userAInfo.name,
        VrstaTransakcije: 'Isplata',
        Opis: itm.transaction,
        IznosTransakcije: itm.amount,
        Smjer: 'I',
        BrojRacunaB: accBInfo.accNo,
        SWIFTB: accBInfo.swift,
        BankaB: accBInfo.bank,
        DrzavaB: accBInfo.country,
        NazivB: userBInfo.name,
      })
    })
    this.isLoading = false
  }
}
