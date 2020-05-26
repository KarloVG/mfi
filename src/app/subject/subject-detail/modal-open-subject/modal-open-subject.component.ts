import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
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
    DatumOtvaranjaOd: [''],
    DatumOtvaranjaDo: [''],
  });
  subjects: ISimpleDropdownItem[] = [];

  isSubjectSelected: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private subjectStatusService: SubjectStatusService,
    private subjectService: SubjectService,
    private modal: NgbActiveModal
  ) { }

  ngOnInit(): void {
    this.getSubjectStatuses();
    this.subjectService.getSubjectsDropdown().pipe(untilComponentDestroyed(this)).subscribe(
      response => {
        this.subjects = response;
      }
    )
  }

  ngOnDestroy(): void {

  }

  onSubmit(): void {

  }
  

  clearFilters(): void {
    this.subjects = [];
  }

  filterSubjects() {
    
  }

  onSelectSubject(event) {
    console.log(event)
  }

  exitModal() {
    this.modal.close(false)
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
}
