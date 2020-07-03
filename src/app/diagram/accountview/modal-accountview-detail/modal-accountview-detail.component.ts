import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DiagramService } from 'src/app/shared/services/diagram.service'

@Component({
  selector: 'app-modal-accountview-detail',
  templateUrl: './modal-accountview-detail.component.html',
  styleUrls: ['./modal-accountview-detail.component.scss']
})
export class ModalAccountviewDetailComponent implements OnInit {
  @Input() node: any;
  @Input() inputUser: any;

  isLoading: boolean = true;
  userTransactions: any[] = [];

  constructor(
    private diaSvc: DiagramService,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.userTransactions = []
    console.log('NODET', this.node)

    let accAInfo = this.node.account
    let userAInfo = this.node.account.user

    this.node.transactions.transactions.inbound.forEach(itm => {
      let accBInfo = this.diaSvc.getAccounts(itm.dest)
      let userBInfo = this.diaSvc.getPerson(accBInfo.userId)
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
    this.node.transactions.transactions.outbound.forEach(itm => {
      let accBInfo = this.diaSvc.getAccounts(itm.dest)
      let userBInfo = this.diaSvc.getPerson(accBInfo.userId)
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
