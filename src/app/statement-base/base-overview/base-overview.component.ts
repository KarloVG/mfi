import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { OVERVIEW_COLUMNS } from '../mock-data/base-overview-columns';
import { BaseService } from '../services/base.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ModalAddPersonComponent } from '../modal-add-person/modal-add-person.component';
import { IBaseItem } from '../models/base-item';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { ModalImportFileComponent } from './modal-import-file/modal-import-file.component';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import { ModalImportTirmComponent } from './modal-import-tirm/modal-import-tirm.component';

@Component({
  selector: 'app-base-overview',
  templateUrl: './base-overview.component.html',
  styleUrls: ['./base-overview.component.scss']
})
export class BaseOverviewComponent implements OnInit, OnDestroy {

  @ViewChild('myTable') table: any;
  filterValue: string;
  columns: any[] = OVERVIEW_COLUMNS;
  isLoading: boolean = true;
  baseItems: IBaseItem[] = [];
  staticValue: IBaseItem[] = [];
  peopleOnSubject: ISimpleDropdownItem[] = [];

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
        this.staticValue = data;
        this.isLoading = false;
      }
    )
  }

  filterUserTable() {
    let searchVal = this.filterValue.toLowerCase()
    let keys = ["Osoba"];
    let colsAmt = keys.length + 1;
    this.baseItems = this.staticValue.filter(function (item) {
      for (let i = 0; i < colsAmt; i++) {
        if (item[keys[i]]) {
          if (
            item[keys[i]] != null &&
            item[keys[i]].Naziv.toLowerCase().indexOf(searchVal) !== -1) {
            return true;
          }
        } else {
          if (item[keys[i]] != null && item[keys[i]].toString().toLowerCase().indexOf(searchVal) !== -1) {
            return true;
          }
        }
        return false;
      }
    });
  }


  removeFilter() {
    this.filterValue = '';
    this.baseItems = this.staticValue;
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
        });
        this.getBaseItems();
      } else {
        this.toastr.warning('Osoba nije dodana na predmet', 'Pažnja', {
          progressBar: true
        });
      }
    }).catch((res) => { });
  }

  editPerson(row: IBaseItem) {
    if (row && row.Osoba) {
      const modalRef = this.ngbModalService.open(ModalAddPersonComponent, { backdrop: 'static', keyboard: false });
      modalRef.componentInstance.baseItem = row;
      modalRef.result.then((result) => {
        if (result) {
          this.toastr.success('Osoba na predmetu je uređena', 'Uspjeh', {
            progressBar: true
          });
          this.getBaseItems();
        } else {
          this.toastr.warning('Osoba na predmetu nije uređena', 'Pažnja', {
            progressBar: true
          });
        }
      }).catch((res) => { });
    }
  }

  deletePerson(row) {
    if (row && row.Osoba) {
      const modalRef = this.ngbModalService.open(ConfirmationModalComponent, { backdrop: 'static', keyboard: false });
      if (row.UvezeneIzliste && row.BrojTransakcija) {
        modalRef.componentInstance.title = 'Brisanje osobe i izlista za osobu';
        modalRef.componentInstance.description = `Za odabranu fizičku osobu: "${row.Osoba.Naziv}" će biti obrisani SVI uvezeni izlisti: ukupno, biti će obrisano
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

  openBaseImportFromFile() {
    this.peopleOnSubject = [];
    this.baseItems.forEach(
      item => {
        this.peopleOnSubject.push({
          id: item.Osoba.OsobaID,
          name: item.Osoba.Naziv
        })
      }
    );
    const modalRef = this.ngbModalService.open(ModalImportFileComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.peopleOnSubject = this.peopleOnSubject;
    modalRef.result.then((result) => {
      if (result) {
        this.toastr.success('Izvod iz datoteke je dodan', 'Uspjeh', {
          progressBar: true
        })
      } else {
        this.toastr.warning('Izvod iz datoteke nije dodan', 'Pažnja', {
          progressBar: true
        })
      }
    }).catch((res) => { });
  }

  getBaseFromTIRM() {
    this.peopleOnSubject = [];
    this.baseItems.forEach(
      item => {
        this.peopleOnSubject.push({
          id: item.Osoba.OsobaID,
          name: item.Osoba.Naziv
        })
      }
    );
    const modalRef = this.ngbModalService.open(ModalImportTirmComponent, { size: 'xl', backdrop: 'static', keyboard: false, windowClass: 'largeModalClass' });
    modalRef.componentInstance.peopleOnSubject = this.peopleOnSubject;
    modalRef.result.then((result) => {
      if (result) {
        this.toastr.success('Izvod iz datoteke je dodan', 'Uspjeh', {
          progressBar: true
        })
      } else {
        this.toastr.warning('Izvod iz datoteke nije dodan', 'Pažnja', {
          progressBar: true
        })
      }
    }).catch((res) => { });
  }

  toggleExpandRow(row) {
    this.table.rowDetail.toggleExpandRow(row);
  }
}
