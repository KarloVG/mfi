import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import { SubjectStatusService } from '../../services/subject-status.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { NgbActiveModal, NgbDateParserFormatter, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from 'src/app/shared/utils/ngb-date-custom-parser-formatter';
import { CustomDatepickerI18n } from 'src/app/shared/utils/custom-date-picker-i18n';
import { SubjectService } from '../../services/subject.service';

@Component({
  selector: 'app-modal-open-subject',
  templateUrl: './modal-open-subject.component.html',
  styleUrls: ['./modal-open-subject.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }
  ]
})
export class ModalOpenSubjectComponent implements OnInit, OnDestroy {

  subjectStatuses: ISimpleDropdownItem[] = [];
  existingSubjectGroup: FormGroup = this.formBuilder.group({
    StatusPredmeta: [null],
    DatumOtvaranjaOd: [null],
    DatumOtvaranjaDo: [null],
    Subject: [null, Validators.required]
  });
  subjects: ISimpleDropdownItem[] = [];
  isSubjectSelected: boolean = false;
  subjectId: number;

  constructor(
    private formBuilder: FormBuilder,
    private subjectStatusService: SubjectStatusService,
    private subjectService: SubjectService,
    private modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.getSubjectStatuses();
  }

  ngOnDestroy(): void { }

  onSubmit(): void {
    console.log(this.existingSubjectGroup)
    if (this.existingSubjectGroup.invalid) {
      return;
    } else {
      this.modal.close(this.Subject.value)
    }
  }

  clearFilters(): void {
    this.subjects = [];
    this.existingSubjectGroup.patchValue({
      Subject: null
    });
  }

  filterSubjects() {
    this.getSubjects();
  }

  getSubjects() {
    this.subjectService.getSubjectsDropdown().pipe(untilComponentDestroyed(this)).subscribe(
      response => {
        this.subjects = response;
      }
    )
  }

  onClickSubjectDropdown(event: MouseEvent) {
    if(event && event.target) {
      this.isSubjectSelected = true;
    } else {
      this.isSubjectSelected = false;
    }
  }

  exitModal() {
    this.modal.dismiss()
  }

  getSubjectStatuses(): void {
    this.subjectStatusService.getSubjectStatuses().pipe(untilComponentDestroyed(this)).subscribe(
      data => {
        this.subjectStatuses = data;
      }
    )
  }

  get StatusPredmeta(): AbstractControl {
    return this.existingSubjectGroup.get('StatusPredmeta');
  }
  get DatumOtvaranjaOd(): AbstractControl {
    return this.existingSubjectGroup.get('DatumOtvaranjaOd');
  }
  get DatumOtvaranjaDo(): AbstractControl {
    return this.existingSubjectGroup.get('DatumOtvaranjaDo');
  }
  get Subject(): AbstractControl {
    return this.existingSubjectGroup.get('Subject');
  }
}
