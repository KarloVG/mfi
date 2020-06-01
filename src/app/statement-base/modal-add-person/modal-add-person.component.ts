import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IPerson } from '../models/person';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import { BaseService } from '../services/base.service';
import { forkJoin, Observable } from 'rxjs';
import { ReactiveFormValidatorService } from '../services/reactive-form-validator.service';

@Component({
  selector: 'app-modal-add-person',
  templateUrl: './modal-add-person.component.html',
  styleUrls: ['./modal-add-person.component.scss']
})
export class ModalAddPersonComponent implements OnInit {

  @Input() person: IPerson;
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
      if(this.person && this.person.IdBroj) {
        this.personGroup.patchValue({
          OsobaID: this.person.OsobaID,
          Naziv: this.person.Naziv,
          TipOsobe: this.person.TipOsobe.id,
        });
        if(this.person.VrstaIdBroja) {
          this.personGroup.patchValue({ VrstaIdBroja: this.person.VrstaIdBroja.id });
          this.reactiveFormService.setValidatorAfterViewInit(this.personGroup,this.person.IdBroj, 'IdBroj');
        }
      }
    })
  }

  exitModal() {
    this.modal.close(false);
    console.log(this.Naziv.validator)
  }

  onSubmit() {
    if(this.personGroup.invalid) {
      return;
    } else {
      this.modal.close(this.personGroup);
    }
  }

  onChangeIDType(event) {
    const idNumber = this.IdBroj.value ? this.IdBroj.value : ''
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
