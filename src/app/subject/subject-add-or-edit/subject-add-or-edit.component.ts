import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SubjectService } from '../services/subject.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormArray, FormGroupDirective } from '@angular/forms';
import { SubjectStatusService } from '../services/subject-status.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import { ISubject } from '../models/subject';
import { ISubjectPermission } from '../models/subject-permission';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { ModalSubjectPermissionComponent } from '../subject-detail/modal-subject-permission/modal-subject-permission.component';
import { NgbDateParserFormatter, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { CustomDatepickerI18n } from 'src/app/shared/utils/custom-date-picker-i18n';
import { NgbDateCustomParserFormatter } from 'src/app/shared/utils/ngb-date-custom-parser-formatter';
import { Observable, Subject } from 'rxjs';
import { ModalCanDeactivateComponent } from './modal-can-deactivate/modal-can-deactivate.component';
import { CanComponentDeactivate } from 'src/app/shared/services/confirm-exit-popup-guard';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NavigationService } from 'src/app/shared/services/navigation.service';

@Component({
  selector: 'app-subject-add-or-edit',
  templateUrl: './subject-add-or-edit.component.html',
  styleUrls: ['./subject-add-or-edit.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }
  ]
})
export class SubjectAddOrEditComponent implements OnInit, CanComponentDeactivate {
  @ViewChild('myForm') myForm: FormGroupDirective;
  @Input() passEntry;

  private confimationSubject = new Subject<boolean>();
  subjectStatuses: ISimpleDropdownItem[] = [];
  subjectFormGroup: FormGroup = this.formBuilder.group({
    predmetID: null,
    brojPredmeta: ['', Validators.required],
    nazivPredmeta: ['', Validators.required],
    datumOtvaranja: ['', Validators.required],
    statusPredmetaID: [null, Validators.required],
    napomena: [''],
    predmetKorisnici: this.formBuilder.array([])
  });
  subjectId: number;
  subject: ISubject;
  
  private dynamicDate = new Date();
  dynamicToday = {
    year: this.dynamicDate.getFullYear(),
    month: this.dynamicDate.getMonth() + 1,
    day: this.dynamicDate.getDate()
  }

  isReadOnly: boolean = false;
  //deativation guard
  isSubmited: boolean = false;
  subjectName: string = '';

  adalUser: ISubjectPermission = {
    korisnikID: 15,
    ime: 'Željko',
    prezime: 'Malnar',
    Flag: false,
    loginName: 'zeljko.malnar@gmailloginName',
    isFromAd: true
  }

  constructor(
    private formBuilder: FormBuilder,
    private subjectStatusService: SubjectStatusService,
    private ngbModalService: NgbModal,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private subjectService: SubjectService,
    private router: Router,
    private navigationService: NavigationService
  ) { }

  ngOnInit(): void {
    this.getSubjectStatuses();
    this.nazivPredmeta.valueChanges.pipe(untilComponentDestroyed(this)).subscribe(
      data => {
        this.subjectName = data ? data : '';
      }
    )
    this.subjectId = +this.activatedRoute.snapshot.paramMap.get('id') || null;
    if (this.subjectId) {
      this.subjectService.getSubjectById(this.subjectId).pipe(untilComponentDestroyed(this)).subscribe(
        data => {
          this.subject = data;
          console.log(this.subject)
          this.subjectFormGroup.patchValue({
            predmetID: this.subject.predmetID,
            brojPredmeta: this.subject.brojPredmeta,
            nazivPredmeta: this.subject.nazivPredmeta,
            datumOtvaranja: new Date(this.subject.datumOtvaranja),
            statusPredmetaID: this.subject.statusPredmetaID,
            napomena: this.subject.napomena,
          })
          this.subject.predmetKorisnici.forEach(
            korisnik => {
              this.predmetKorisnici.push(this.formBuilder.group({
                ID: korisnik.ID,
                Ime: korisnik.Ime,
                Prezime: korisnik.Prezime,
                Flag: korisnik.Flag,
                loginName: korisnik.loginName,
                isFromAd: korisnik.isFromAd
              }))
            }
          );
          console.log(this.subjectFormGroup)
        },
        err => {
          /* ovo maknuti kad stigne backend */
          localStorage.removeItem('subject_id');
          this.navigationService.publishNavigationChange();
          this.router.navigate(['welcome']);
        }
      )
    } else {
      this.predmetKorisnici.push(this.formBuilder.group({
        ID: this.adalUser.ID,
        Ime: this.adalUser.Ime,
        Prezime: this.adalUser.Prezime,
        Flag: this.adalUser.Flag,
        loginName: this.adalUser.loginName,
        isFromAd: this.adalUser.isFromAd
      }));
    }
  }

  // moramo imati zbog untilComponentDestroyed
  ngOnDestroy(): void {}

  getSubjectStatuses(): void {
    this.subjectStatusService.getSubjectStatuses().pipe(untilComponentDestroyed(this)).subscribe(
      data => {
        this.subjectStatuses = data;
      }
    )
  }

  navigateToWelcome() {
    if (this.subjectId) {
      this.router.navigate(['subject', this.subjectId])
    } else {
      this.router.navigate(['welcome']);
    }
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.subjectFormGroup.dirty) {
      const modalRef = this.ngbModalService.open(ModalCanDeactivateComponent, { backdrop: 'static', keyboard: false });
      modalRef.componentInstance.subjectName = this.subjectId ? this.nazivPredmeta.value : '';
      modalRef.result.then((result) => {
        if (result == true) {
          if (this.subjectId) {
            this.confimationSubject.next(true);
            this.editSubjectWithoutNavigating();
          } else {
            if (this.subjectFormGroup.invalid) {
              this.subjectFormGroup.markAllAsTouched();
              this.toastr.error('Nisu ispunjena sva obavezna polja', 'Greška', {
                progressBar: true
              });
              this.confimationSubject.next(false);
            } else {
              this.toastr.success('Pohranili ste novi predmet', 'Uspjeh', {
                progressBar: true
              });
              this.confimationSubject.next(true);
              this.navigationService.publishNavigationChange();
            }
          }
        } else if (result == false) {
          this.toastr.warning('Stanje predmeta nije pohranjeno', 'Pažnja', {
            progressBar: true
          });
          this.confimationSubject.next(true);
        } else {
          this.confimationSubject.next(false);
        }
      }).catch((res) => {
      });
      return this.confimationSubject;
    } else {
      return true;
    }
  }

  openPermissionModal(): void {
    const modalRef = this.ngbModalService.open(ModalSubjectPermissionComponent, { backdrop: 'static', keyboard: false });
    modalRef.result.then((result) => {
      if (result) {
        this.predmetKorisnici.push(this.formBuilder.group({
          ID: result.ID,
          Ime: result.Ime,
          Prezime: result.Prezime,
          Flag: result.Flag,
          loginName: result.loginName,
          isFromAd: result.isFromAd
        }));
        this.toastr.success('Dodana je nova dozvola na rad', 'Uspjeh', {
          progressBar: true
        })
      }
    }).catch((res) => { });
  }

  removePermission(user, item) {
    if (user.value && user.value.isFromAd) {
      this.toastr.error('Korisnika koji je kreirao predmet nije moguće izbrisati!', 'Pogreška', {
        progressBar: true
      });
    } else {
      this.toastr.warning('Izbrisana je dozvola za rad', 'Uspjeh', {
        progressBar: true
      })
      this.predmetKorisnici.removeAt(item)
    }
  }

  onSubmit() {
    if (this.subjectFormGroup.invalid) {
      // triggers contitional for myForm.submitted on html
      return;
    } else {
      if (this.subjectId) {
        this.editSubject();
      } else {
        this.addSubject();
      }
    }
  }

  editSubject() {
    this.subjectService.editSubject(this.subjectId, this.subjectFormGroup.value).pipe(untilComponentDestroyed(this))
      .subscribe(responseData => {
        console.log(responseData)
        this.subjectFormGroup.markAsPristine();
        this.toastr.success('Uredili ste predmet', 'Uspjeh', {
          progressBar: true
        });
        this.navigationService.publishNavigationChange();
        this.router.navigate(['subject', this.subjectId]);
      })
  }

  editSubjectWithoutNavigating() {
    this.subjectService.editSubject(this.subjectId, this.subjectFormGroup.value).pipe(untilComponentDestroyed(this))
      .subscribe(responseData => {
        console.log(responseData)
        this.subjectFormGroup.markAsPristine();
        this.toastr.success('Uredili ste predmet', 'Uspjeh', {
          progressBar: true
        });
      })
  }

  addSubject() {
    console.log(this.subjectFormGroup.value)
    this.subjectService.addSubject(this.subjectFormGroup.value).pipe(untilComponentDestroyed(this))
      .subscribe(response => {
        localStorage.setItem('subject_id', response.predmetID.toString());
        this.subjectFormGroup.markAsPristine();
        this.toastr.success('Pohranili ste novi predmet', 'Uspjeh', {
          progressBar: true
        });
        this.navigationService.publishNavigationChange();
        this.router.navigate(['subject', response.predmetID]);
      })
  }

  get brojPredmeta(): AbstractControl {
    return this.subjectFormGroup.get('brojPredmeta');
  }
  get datumOtvaranja(): AbstractControl {
    return this.subjectFormGroup.get('datumOtvaranja');
  }
  get nazivPredmeta(): AbstractControl {
    return this.subjectFormGroup.get('nazivPredmeta');
  }
  get statusPredmetaID(): AbstractControl {
    return this.subjectFormGroup.get('statusPredmetaID');
  }
  get napomena(): AbstractControl {
    return this.subjectFormGroup.get('napomena');
  }
  get predmetKorisnici(): FormArray {
    return this.subjectFormGroup.get('predmetKorisnici') as FormArray;
  }
}
