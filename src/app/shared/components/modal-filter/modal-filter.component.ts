import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbDateParserFormatter, NgbDatepickerI18n} from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { ISimpleDropdownItem } from '../../models/simple-dropdown-item';
import { ToastrService } from 'ngx-toastr';
import { CustomDatepickerI18n } from '../../utils/custom-date-picker-i18n';
import { NgbDateCustomParserFormatter } from '../../utils/ngb-date-custom-parser-formatter';
import { LocalStoreFilterService } from '../../services/local-store-filter.service';
import { IFilterCriteria } from '../../models/filter-criteria';
import { Observable, forkJoin } from 'rxjs';
import { BankService } from '../../services/bank-service';
import { IBank } from '../../models/bank';
import { TransactionTypeService } from '../../services/transaction-type-service';
import { ITransactionType } from '../../models/transaction-type';
import { ICountry } from '../../models/country';
import { CountryService } from '../../services/country-service';
import { countriesLatLng } from 'src/app/map/countries';

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

  localStoreFilterValues: IFilterCriteria;
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

  forkObservable: Observable<any>;
  banks: Observable<IBank[]>;
  transactionTypes: Observable<ITransactionType[]>;
  countries: ICountry[];

  directions: ITransactionType[] = [{
    id: 1,
    name: 'Ulazni'
  },{
    id: 2,
    name: 'Izlazni'
  }]
  
  constructor(
    public modal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private localStoreFilterService: LocalStoreFilterService,
    private transactionTypeService: TransactionTypeService,
    private bankService: BankService,
    // private countryService: CountryService
    ) {}

  ngOnInit(): void {
    //fork join
    this.countries = countriesLatLng;
    this.forkObservable = forkJoin(
      this.transactionTypeService.getTransactionType(),
      this.bankService.getBanke(),
      // this.countryService.getCountries(),
    );

    this.forkObservable.subscribe(([transactions, banks, countries]) => {
      this.transactionTypes  = transactions;
      this.banks = banks;

      // after values come 
      const filterValues = this.localStoreFilterService.hasToken();
      if(filterValues) {
        this.filterFormGroup.patchValue({
          Naziv: filterValues.Naziv ? filterValues.Naziv : '',
          NazivB: filterValues.NazivB ? filterValues.NazivB : '',
          BrojRacuna: filterValues.BrojRacuna ? filterValues.BrojRacuna : '',
          BrojRacunaB: filterValues.BrojRacunaB ? filterValues.BrojRacunaB : '',
          Banka: filterValues.Banka ? filterValues.Banka : null,
          BankaB: filterValues.BankaB ? filterValues.BankaB : null,
          Drzava: filterValues.Drzava ? filterValues.Drzava : null,
          DrzavaB: filterValues.DrzavaB ? filterValues.DrzavaB : null,
          DatumTrasakcijeOd: filterValues.DatumTrasakcijeOd ? new Date(filterValues.DatumTrasakcijeOd) : '',
          DatumTrasakcijeDo: filterValues.DatumTrasakcijeDo ? new Date(filterValues.DatumTrasakcijeDo) : '',
          IznosOd: filterValues.IznosOd ? filterValues.IznosOd : '',
          IznosDo: filterValues.IznosDo ? filterValues.IznosDo : '',
          Smjer: filterValues.Smjer ? filterValues.Smjer : null,
          VrstaTransakcije: filterValues.VrstaTransakcije ? filterValues.VrstaTransakcije : null,
        });
      }
      console.log(this.transactionTypes, this.banks, this.countries)
    });

  }

  onSubmit(): void {
    if(!this.Naziv.value && !this.NazivB.value && !this.BrojRacuna.value && !this.BrojRacunaB.value && !this.Banka.value && !this.BankaB.value && !this.Drzava.value
      && !this.DrzavaB.value && !this.DatumTrasakcijeDo.value && !this.DatumTrasakcijeOd.value && !this.VrstaTransakcije.value && !this.Smjer.value && !this.IznosDo.value && !this.IznosOd.value) {
        this.toastr.warning('Filter mora sadržavati minimalno 1 polje', 'Pogreška', { progressBar: true })
    } else {
      // save filter values to localstorage
      localStorage.setItem('is_filter_active', 'true');
      localStorage.setItem('filter_fields', JSON.stringify(this.filterFormGroup.value));
      this.modal.close(true)
    }
  }

  exitModal() {
    localStorage.removeItem('is_filter_active');
    localStorage.removeItem('filter_fields');
    this.modal.close(false)
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
