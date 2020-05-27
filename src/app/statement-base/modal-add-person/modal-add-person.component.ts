import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IPerson } from '../models/person';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import { BaseService } from '../services/base.service';
import { take } from 'rxjs/operators';

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

  constructor(
    private formBuilder: FormBuilder,
    private modal: NgbActiveModal,
    private baseService: BaseService
  ) { }

  ngOnInit(): void {
    this.getPersonTypes();
    this.getIdentificationTypes();
    if(this.person && this.person.IdBroj) {
      this.personGroup.patchValue({
        OsobaID: this.person.OsobaID,
        Naziv: this.person.Naziv,
        TipOsobe: this.person.TipOsobe.id,
        IdBroj: this.person.IdBroj,
        VrstaIdBroja: this.person.VrstaIdBroja.id
      });
    }
  }

  exitModal() {
    this.modal.close(false)
  }

  onSubmit() {
    if(this.personGroup.invalid) {
      return;
    } else {
      this.modal.close(this.personGroup);
    }
  }

  getPersonTypes() {
    this.baseService.getPersonTypes().pipe(take(1)).subscribe(data => {
      this.personTypes = data;
    });
  }

  getIdentificationTypes() {
    this.baseService.getIdentificationTypes().pipe(take(1)).subscribe(data => {
      this.identificationTypes = data;
    });
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
