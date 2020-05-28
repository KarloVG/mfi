import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { OVERVIEW_COLUMNS } from '../mock-data/base-overview-columns';
import { BaseService } from '../services/base.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ModalAddPersonComponent } from '../modal-add-person/modal-add-person.component';
import { IBaseItem } from '../models/base-item';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-base-overview',
  templateUrl: './base-overview.component.html',
  styleUrls: ['./base-overview.component.scss']
})
export class BaseOverviewComponent implements OnInit, OnDestroy {

  @ViewChild('myTable') table: any;
  
  columns: any[] = OVERVIEW_COLUMNS;
  isLoading: boolean = true;
  baseItems: IBaseItem[] = [];

  constructor(
    private baseService: BaseService,
    private ngbModalService: NgbModal,
    private toastr: ToastrService
  ) { }

  ngOnDestroy(): void { }

  ngOnInit(): void {
    this.getBaseItems();
  }

  getBaseItems(): void {
    this.baseService.getBaseItems().pipe(untilComponentDestroyed(this)).subscribe(
      data => {
        this.baseItems = data;
        this.isLoading = false;
      }
    )
  }

  onDetailToggle(event): void {
    console.log(event);
  }

  addPersonToBase() {
    const modalRef = this.ngbModalService.open(ModalAddPersonComponent, { backdrop: 'static', keyboard: false });
    modalRef.result.then((result) => {
      if (result) {
        this.toastr.success('Osoba je dodana na predmet', 'Uspjeh', {
          progressBar: true
        })
      } else {
        this.toastr.warning('Osoba nije dodana na predmet', 'Pažnja', {
          progressBar: true
        })
      }
    }).catch((res) => { });
  }

  editPerson(row: IBaseItem) {
    if(row && row.Osoba) {
      const modalRef = this.ngbModalService.open(ModalAddPersonComponent, { backdrop: 'static', keyboard: false });
      modalRef.componentInstance.person = row.Osoba;
      modalRef.result.then((result) => {
        if (result) {
          this.toastr.success('Osoba na predmetu je uređena', 'Uspjeh', {
            progressBar: true
          })
        } else {
          this.toastr.warning('Osoba na predmetu nije uređena', 'Pažnja', {
            progressBar: true
          })
        }
      }).catch((res) => { });
    }
  }

  deletePerson(row) {
    if(row && row.Osoba){
      const modalRef = this.ngbModalService.open(ConfirmationModalComponent, { backdrop: 'static', keyboard: false });
      if(row.UvezeneIzliste && row.BrojTransakcija) {
        modalRef.componentInstance.title = 'Brisanje osobe i izlista za osobu';
        modalRef.componentInstance.description = `Za odabranu fizičku osobu: "${row.Osoba.Naziv}" će biti obrisani SVI uvezeni listi: ukupno, biti će obrisano
        "${row.UvezeneIzliste}" uvezena izlista na kojima je evidentirano "${row.BrojTransakcija}" financijskih transakcija`;
      } else {
        modalRef.componentInstance.title = 'Uklanjanje osobe sa predmeta';
        modalRef.componentInstance.description = `Odabrana fizička osoba "${row.Osoba.Naziv}" će biti uklonjena iz baze izlista
        i neće biti moguće uvoziti izliste za tu osobu`;
      }
      modalRef.componentInstance.class = true; // text danger
      modalRef.result.then((result) => {
        if (result) {
          this.toastr.success('Osoba na predmetu je izbrisana', 'Uspjeh', {
            progressBar: true
          })
        } else {
          this.toastr.warning('Osoba na predmetu nije obrisana', 'Pažnja', {
            progressBar: true
          })
        }
      }).catch((res) => { });
    }
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }
}
