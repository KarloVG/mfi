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

@Component({
  selector: 'app-subject-add-or-edit',
  templateUrl: './subject-add-or-edit.component.html',
  styleUrls: ['./subject-add-or-edit.component.scss'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }
  ]
})
export class SubjectAddOrEditComponent implements OnInit, CanComponentDeactivate{
  @ViewChild('myForm') myForm: FormGroupDirective; 
  @Input() passEntry;
  
  private confimationSubject = new Subject<boolean>();
  subjectStatuses: ISimpleDropdownItem[] = [];
  subjectFormGroup: FormGroup = this.formBuilder.group({
    PredmetID: null,
    BrojPredmeta: ['', Validators.required],
    NazivPredmeta: ['', Validators.required],
    DatumOtvaranja: ['', Validators.required],
    StatusPredmeta: [null, Validators.required],
    Napomena: [''],
    DozvoljeniKorisnici: this.formBuilder.array([])
  });
  subjectId: number;
  subject: ISubject;

  isReadOnly: boolean = false;
  //deativation guard
  isSubmited: boolean = false;
  subjectName: string = '';

  adalUser: ISubjectPermission = {
    ID: 15,
    Ime: 'David',
    Prezime: 'Corona',
    Flag: false,
    Email: 'david.corona@gmail.com',
    isAdalUser: true
  }

  constructor(
    private formBuilder: FormBuilder,
    private subjectStatusService: SubjectStatusService,
    private ngbModalService: NgbModal,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private subjectService: SubjectService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getSubjectStatuses();
    this.NazivPredmeta.valueChanges.pipe(untilComponentDestroyed(this)).subscribe(
      data => {
        this.subjectName = data ? data : '';
      }
    )
    this.subjectId = +this.activatedRoute.snapshot.paramMap.get('id') || null;
    if (this.subjectId) {
      this.subjectService.getSubjectById(this.subjectId).pipe(untilComponentDestroyed(this)).subscribe(
        data => {
          this.subject = data;
          this.subjectFormGroup.patchValue({
            PredmetID: this.subject.PredmetID,
            BrojPredmeta: this.subject.BrojPredmeta,
            NazivPredmeta: this.subject.NazivPredmeta,
            DatumOtvaranja: new Date(this.subject.DatumOtvaranja),
            StatusPredmeta: this.subject.StatusPredmeta,
            Napomena: this.subject.Napomena,
          })
          this.subject.DozvoljeniKorisnici.forEach(
            korisnik => {
              this.DozvoljeniKorisnici.push(this.formBuilder.group({
                ID: korisnik.ID,
                Ime: korisnik.Ime,
                Prezime: korisnik.Prezime,
                Flag: korisnik.Flag,
                Email: korisnik.Email,
                isAdalUser: korisnik.isAdalUser
              }))
            }
          );
        }
      )
    } else {
      this.DozvoljeniKorisnici.push(this.formBuilder.group({
        ID: this.adalUser.ID,
        Ime: this.adalUser.Ime,
        Prezime: this.adalUser.Prezime,
        Flag: this.adalUser.Flag,
        Email: this.adalUser.Email,
        isAdalUser: this.adalUser.isAdalUser
      }));
    }
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
      modalRef.componentInstance.subjectName = this.subjectId ? this.NazivPredmeta.value : '';
      modalRef.result.then((result) => {
        if (result == true) {
          if(this.subjectId) {
            console.log('kak')
            this.toastr.success('Uredili ste predmet', 'Uspjeh', {
              progressBar: true
            });
            this.confimationSubject.next(true);
          } else {
            if(this.subjectFormGroup.invalid) {
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
            }
          }
        } else if(result == false) {
          this.toastr.warning('Stanje predmeta nije pohranjeno', 'Pažnja', {
            progressBar: true
          });
          this.confimationSubject.next(true);
        } else {
          this.confimationSubject.next(false);
        }
      }).catch((res) => {
        console.log(res)
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
        this.DozvoljeniKorisnici.push(this.formBuilder.group({
          ID: result.ID,
          Ime: result.Ime,
          Prezime: result.Prezime,
          Flag: result.Flag,
          Email: result.Email,
          isAdalUser: result.isAdalUser
        }));
        this.toastr.success('Dodana je nova dozvola na rad', 'Uspjeh', {
          progressBar: true
        })
      }
    }).catch((res) => { });
  }

  removePermission(user, item) {
    if (user.value && user.value.isAdalUser) {
      this.toastr.error('Korisnika koji je kreirao predmet nije moguće izbrisati!', 'Pogreška', {
        progressBar: true
      });
    } else {
      this.toastr.warning('Izbrisana je dozvola za rad', 'Uspjeh', {
        progressBar: true
      })
      this.DozvoljeniKorisnici.removeAt(item)
    }
  }

  onSubmit() {
    if (this.subjectId) {
      this.subjectFormGroup.markAsPristine();
      this.toastr.success('Uredili ste predmet', 'Uspjeh', {
        progressBar: true
      })
      this.router.navigate(['subject', 1]);
    } else {
      if (this.subjectFormGroup.invalid) {
        // triggers contitional for myForm.submitted on html
        return;
      } else {
        this.subjectFormGroup.markAsPristine();
        this.toastr.success('Pohranili ste novi predmet', 'Uspjeh', {
          progressBar: true
        });
        this.router.navigate(['subject', 1])
      }
    }
  }

  

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
  get DozvoljeniKorisnici(): FormArray {
    return this.subjectFormGroup.get('DozvoljeniKorisnici') as FormArray;
  }
}
