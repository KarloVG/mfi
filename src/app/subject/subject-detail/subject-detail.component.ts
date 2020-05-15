import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { SubjectStatusService } from '../services/subject-status.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import { ISubjectPermission } from '../models/subject-permission';
import { NgbModal, NgbDateParserFormatter, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { ModalSubjectPermissionComponent } from './modal-subject-permission/modal-subject-permission.component';
import { CustomDatepickerI18n } from 'src/app/shared/utils/custom-date-picker-i18n';
import { NgbDateCustomParserFormatter } from 'src/app/shared/utils/ngb-date-custom-parser-formatter';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subject-detail',
  templateUrl: './subject-detail.component.html',
  styleUrls: ['./subject-detail.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }
  ]

})
export class SubjectDetailComponent implements OnInit, OnDestroy {

  subjectStatuses: ISimpleDropdownItem[] = [];
  subjectFormGroup: FormGroup = this.formBuilder.group({
    PredmetID: null,
    BrojPredmeta: ['', Validators.required],
    NazivPredmeta: ['', Validators.required],
    DatumOtvaranja: ['', Validators.required],
    StatusPredmeta: [null, Validators.required],
    Napomena: ['', Validators.required],
  });

  adalUser: ISubjectPermission = {
    ID: 15,
    Ime: 'David',
    Prezime: 'Corona',
    Flag: false,
    Email: 'david.corona@gmail.com',
    isAdalUser: true
  }

  userPermissions: ISubjectPermission[] = [
    this.adalUser
  ];

  constructor(
    private formBuilder: FormBuilder,
    private subjectStatusService: SubjectStatusService,
    private ngbModalService: NgbModal,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getSubjectStatuses();
  }

  // moramo imati zbog untilComponentDestroyed
  ngOnDestroy(): void {
  }

  getSubjectStatuses(): void {
    this.subjectStatusService.getSubjectStatuses().pipe(untilComponentDestroyed(this)).subscribe(
      data => {
        this.subjectStatuses = data;
      }
    )
  }

  openPermissionModal(): void {
    const modalRef = this.ngbModalService.open(ModalSubjectPermissionComponent, { backdrop: 'static', keyboard: false });
    modalRef.result.then((result) => {
      if(result) {
        this.userPermissions.push(result)
      }
    }).catch((res) => {});
  }

  removePermission(item) {
    if(item && item.isAdalUser) {
      this.toastr.error('Korisnika koji je kreirao predmet nije moguće izbrisati!', 'Pogreška', {
        progressBar: true
      });
    } else {
      const index = this.userPermissions.indexOf(item);
      console.log(index)
      if(index > -1) {
        this.userPermissions.splice(index, 1)
      }
    }
  }

  onSubmit() {
    if(this.subjectFormGroup.invalid) {
      // triggers contitional for myForm.submitted on html
      return;
    } else {
      this.toastr.success('Pohranili ste novi predmet', 'Uspjeh', {
        progressBar: true
      });
    }
  }

  //getters - AC
  get BrojPredmeta(): AbstractControl {
    return this.subjectFormGroup.get('BrojPredmeta');
  }
  get DatumOtvaranja(): AbstractControl {
    return this.subjectFormGroup.get('DatumOtvaranja');
  }
  get NazivPredmeta(): AbstractControl {
    return this.subjectFormGroup.get('NazivPredmeta');
  }
  get StatusPredmeta(): AbstractControl {
    return this.subjectFormGroup.get('StatusPredmeta');
  }
  get Napomena(): AbstractControl {
    return this.subjectFormGroup.get('Napomena');
  }
}
