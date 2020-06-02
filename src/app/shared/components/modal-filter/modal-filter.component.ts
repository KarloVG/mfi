import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbDateParserFormatter, NgbDatepickerI18n} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { ISimpleDropdownItem } from '../../models/simple-dropdown-item';
import { ToastrService } from 'ngx-toastr';
import { CustomDatepickerI18n } from '../../utils/custom-date-picker-i18n';
import { NgbDateCustomParserFormatter } from '../../utils/ngb-date-custom-parser-formatter';

@Component({
  selector: 'app-modal-filter',
  templateUrl: './modal-filter.component.html',
  styleUrls: ['./modal-filter.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }
  ]
})
export class ModalFilterComponent implements OnInit {

  filterFormGroup: FormGroup = this.formBuilder.group({
    Naziv: '',
    NazivB: '',
    BrojRacuna: '',
    BrojRacunaB: '',
    Banka: null,
    BankaB: null,
    Drzava: null,
    DrzavaB: null,
    DatumTrasakcijeOd: null,
    DatumTrasakcijeDo: null,
    IznosOd: '',
    IznosDo: '',
    Smjer: null,
    VrstaTransakcije: null
  });

  banks: ISimpleDropdownItem[] = [];
  countries: ISimpleDropdownItem[] = [];
  
  constructor(
    public modal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
    ) {}

  ngOnInit(): void {
  }

  onSubmit(): void {
    if(!this.Naziv.value && !this.NazivB.value && !this.BrojRacuna.value && !this.BrojRacunaB.value && !this.Banka.value && !this.BankaB.value && !this.Drzava.value
      && !this.DrzavaB.value && !this.DatumTrasakcijeDo.value && !this.DatumTrasakcijeOd.value && !this.VrstaTransakcije.value && !this.Smjer.value && !this.IznosDo.value && !this.IznosOd.value) {
        this.toastr.warning('Filter mora sadržavati minimalno 1 polje', 'Pogreška', { progressBar: true })
    } else {
      this.modal.close(true)
    }
  }

  get Naziv(): AbstractControl {
    return this.filterFormGroup.get('Naziv');
  }
  get NazivB(): AbstractControl {
    return this.filterFormGroup.get('NazivB');
  }
  get BrojRacuna(): AbstractControl {
    return this.filterFormGroup.get('BrojRacuna');
  }
  get BrojRacunaB(): AbstractControl {
    return this.filterFormGroup.get('BrojRacunaB');
  }
  get Banka(): AbstractControl {
    return this.filterFormGroup.get('Banka');
  }
  get BankaB(): AbstractControl {
    return this.filterFormGroup.get('BankaB');
  }
  get Drzava(): AbstractControl {
    return this.filterFormGroup.get('Drzava');
  }
  get DrzavaB(): AbstractControl {
    return this.filterFormGroup.get('DrzavaB');
  }
  get DatumTrasakcijeOd(): AbstractControl {
    return this.filterFormGroup.get('DatumTrasakcijeOd');
  }
  get DatumTrasakcijeDo(): AbstractControl {
    return this.filterFormGroup.get('DatumTrasakcijeDo');
  }
  get IznosOd(): AbstractControl {
    return this.filterFormGroup.get('IznosOd');
  }
  get IznosDo(): AbstractControl {
    return this.filterFormGroup.get('IznosDo');
  }
  get Smjer(): AbstractControl {
    return this.filterFormGroup.get('Smjer');
  }
  get VrstaTransakcije(): AbstractControl {
    return this.filterFormGroup.get('VrstaTransakcije');
  }
}
