import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import { BaseService } from '../services/base.service';
import { forkJoin, Observable } from 'rxjs';
import { ReactiveFormValidatorService } from '../services/reactive-form-validator.service';
import { ITipOsobe } from '../models/tip-osobe';
import { IOsoba } from '../models/osoba';

@Component({
  selector: 'app-modal-add-person',
  templateUrl: './modal-add-person.component.html',
  styleUrls: ['./modal-add-person.component.scss']
})
export class ModalAddPersonComponent implements OnInit {

  @Input() osoba: IOsoba;
  personGroup: FormGroup = this.formBuilder.group({
    osobaID: [''],
    naziv: ['', Validators.required],
    tipOsobe: [null, Validators.required],
    idBroj: ['', [Validators.required, Validators.minLength(5)]],
    vrstaIdBroja: [null]
  })
  identificationTypes: ISimpleDropdownItem[] = [];
  personTypes: ITipOsobe[] = [
    {
      ID: 1,
      naziv: 'Fizička'
    },
    {
      ID: 2,
      naziv: 'Pravna'
    }
  ];
  $observableJoin: Observable<[ISimpleDropdownItem[]]>;

  constructor(
    private formBuilder: FormBuilder,
    private modal: NgbActiveModal,
    private baseService: BaseService,
    private reactiveFormService: ReactiveFormValidatorService
  ) { }

  ngOnInit(): void {
    this.$observableJoin = forkJoin(
      // this.baseService.getPersonTypes(),
      this.baseService.getIdentificationTypes()
    );

    this.$observableJoin.subscribe(data => {
      this.identificationTypes = data[0];
      if (this.osoba) {
        this.personGroup.patchValue({
          osobaID: this.osoba.osobaID,
          naziv: this.osoba.naziv,
          tipOsobe: this.osoba.tipOsobe,
        });
        if (this.osoba.vrstaIdBroja) {
          const vrsta = this.osoba.vrstaIdBroja;
          this.personGroup.patchValue({ vrstaIdBroja: vrsta });
          this.reactiveFormService.setValidatorAfterViewInit(this.personGroup, this.osoba.idBroj, 'idBroj');
        } else if (this.osoba.idBroj) {
          this.personGroup.patchValue({ idBroj: this.osoba.idBroj });
        }
      }
    })
  }

  exitModal() {
    this.modal.close(false);
  }

  onSubmit() {
    if (this.personGroup.invalid) {
      return;
    } else {
      if (this.osoba) {
        this.baseService.editPersonOnBase(this.personGroup.value).subscribe(data => {
          this.modal.close(true);
        })
      } else {
        this.baseService.addPersonOnBase(this.personGroup.value).subscribe(data => {
          this.modal.close(true);
        })
      }
    }
  }

  get osobaID(): AbstractControl {
    return this.personGroup.get('osobaID');
  }
  get naziv(): AbstractControl {
    return this.personGroup.get('naziv');
  }
  get tipOsobe(): AbstractControl {
    return this.personGroup.get('tipOsobe');
  }
  get idBroj(): AbstractControl {
    return this.personGroup.get('idBroj');
  }
  get vrstaIdBroja(): AbstractControl {
    return this.personGroup.get('vrstaIdBroja');
  }
}
