import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { SubjectStatusService } from '../services/subject-status.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';

@Component({
  selector: 'app-subject-detail',
  templateUrl: './subject-detail.component.html',
  styleUrls: ['./subject-detail.component.scss']
})
export class SubjectDetailComponent implements OnInit, OnDestroy {

  subjectStatuses: ISimpleDropdownItem[] = [];
  subjectFormGroup: FormGroup = this.formBuilder.group({
    PredmetID: null,
    BrojPredmeta: '',
    NazivPredmeta: '',
    DatumOtvaranja: '',
    StatusPredmeta: null,
    Napomena: ''
  })

  constructor(
    private formBuilder: FormBuilder,
    private subjectStatusService: SubjectStatusService
  ) { }

  log() {
    console.log(this.BrojPredmeta.value)
  }

  ngOnInit(): void {
    this.getSubjectStatuses();
  }

  // moramo imati zbog untilComponentDestroyed
  ngOnDestroy(): void {
  }


  getSubjectStatuses() {
    this.subjectStatusService.getSubjectStatuses().pipe(untilComponentDestroyed(this)).subscribe(
      data => {
        this.subjectStatuses = data;
      }
    )
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
}
