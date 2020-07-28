import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import { BaseService } from '../services/base.service';
import { forkJoin, Observable } from 'rxjs';
import { ReactiveFormValidatorService } from '../services/reactive-form-validator.service';
import { IBaseItem } from '../models/base-item';

@Component({
  selector: 'app-modal-add-person',
  templateUrl: './modal-add-person.component.html',
  styleUrls: ['./modal-add-person.component.scss']
})
export class ModalAddPersonComponent implements OnInit {

  @Input() baseItem: IBaseItem;
  personGroup: FormGroup = this.formBuilder.group({
    OsobaID: [''],
    Naziv: ['', Validators.required],
    TipOsobe: [null, Validators.required],
    IdBroj: [''],
    VrstaIdBroja: [null]
  })
  identificationTypes: ISimpleDropdownItem[] = [];
  personTypes: ISimpleDropdownItem[] = [];
  $observableJoin: Observable<[ ISimpleDropdownItem[], ISimpleDropdownItem[]  ]>;

  constructor(
    private formBuilder: FormBuilder,
    private modal: NgbActiveModal,
    private baseService: BaseService,
    private reactiveFormService: ReactiveFormValidatorService
  ) { }

  ngOnInit(): void {
    this.$observableJoin = forkJoin(
      this.baseService.getPersonTypes(),
      this.baseService.getIdentificationTypes()
    );

    this.$observableJoin.subscribe( data => {
      this.personTypes = data[0];
      this.identificationTypes = data[1];
      console.log(this.baseItem)
      if(this.baseItem && this.baseItem.Osoba.IdBroj) {
        this.personGroup.patchValue({
          OsobaID: this.baseItem.Osoba.OsobaID,
          Naziv: this.baseItem.Osoba.Naziv,
          TipOsobe: this.baseItem.Osoba.TipOsobeId ? this.baseItem.Osoba.TipOsobeId : this.baseItem.Osoba.TipOsobe.id,
        });
        if(this.baseItem.Osoba.VrstaId || this.baseItem.Osoba.VrstaIdBroja) {
          const vrsta = this.baseItem.Osoba.VrstaId ? this.baseItem.Osoba.VrstaId : this.baseItem.Osoba.VrstaIdBroja.id;
          this.personGroup.patchValue({ VrstaIdBroja: vrsta });
          this.reactiveFormService.setValidatorAfterViewInit(this.personGroup,this.baseItem.Osoba.IdBroj, 'IdBroj');
        }
      }
    })
  }

  exitModal() {
    this.modal.close(false);
  }

  onSubmit() {
    if(this.personGroup.invalid) {
      return;
    } else {
      if(this.baseItem) {
        this.baseService.editPersonOnBase(this.baseItem,this.personGroup.value, this.personTypes, this.identificationTypes).subscribe(data=> {
          this.modal.close(true);
        })
      } else {
        this.baseService.addPersonOnBase(this.personGroup.value, this.personTypes, this.identificationTypes).subscribe(data=> {
          this.modal.close(true);
        })
      }
    }
  }

  onChangeIDType(event) {
    const idNumber = this.IdBroj.value ? this.IdBroj.value : '';
    if(event && event.id) {
      this.reactiveFormService.setValidatorAfterViewInit(this.personGroup, idNumber , 'IdBroj');
    } else {
      this.reactiveFormService.removeValidatorAfterViewInit(this.personGroup, '' , 'IdBroj');
    }
  }

  get OsobaID(): AbstractControl {
    return this.personGroup.get('OsobaID');
  }
  get Naziv(): AbstractControl {
    return this.personGroup.get('Naziv');
  }
  get TipOsobe(): AbstractControl {
    return this.personGroup.get('TipOsobe');
  }
  get IdBroj(): AbstractControl {
    return this.personGroup.get('IdBroj');
  }
  get VrstaIdBroja(): AbstractControl {
    return this.personGroup.get('VrstaIdBroja');
  }
}
