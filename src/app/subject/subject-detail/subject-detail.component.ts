import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl, Validators, FormArray } from '@angular/forms';
import { SubjectStatusService } from '../services/subject-status.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import { ISubjectPermission } from '../models/subject-permission';
import { NgbModal, NgbDateParserFormatter, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { ModalSubjectPermissionComponent } from './modal-subject-permission/modal-subject-permission.component';
import { CustomDatepickerI18n } from 'src/app/shared/utils/custom-date-picker-i18n';
import { NgbDateCustomParserFormatter } from 'src/app/shared/utils/ngb-date-custom-parser-formatter';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectService } from '../services/subject.service';
import { ISubject } from '../models/subject';

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
    Napomena: [''],
    DozvoljeniKorisnici: this.formBuilder.array([])
  });
  subjectId: number;
  subject: ISubject;

  //temporarily 
  subjectStatus: ISimpleDropdownItem;

  isReadOnly: boolean = false;

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
    
    this.subjectId = +this.activatedRoute.snapshot.paramMap.get('id') || null;
    if(this.subjectId) {
      this.subjectService.getSubjectById(this.subjectId).pipe(untilComponentDestroyed(this)).subscribe(
        data => {
          this.subject = data;
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
          )
          this.subjectStatus = this.subjectStatuses.find(x => x.id == this.subject.StatusPredmeta);
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

  openPermissionModal(): void {
    const modalRef = this.ngbModalService.open(ModalSubjectPermissionComponent, { backdrop: 'static', keyboard: false });
    modalRef.result.then((result) => {
      if(result) {
        console.log(result)
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
    }).catch((res) => {});
  }

  removePermission(user,item) {
    if(user.value && user.value.isAdalUser) {
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
    if(this.subject && this.subjectId) {
      this.toastr.success('Uredili ste predmet', 'Uspjeh', {
        progressBar: true
      })
      this.router.navigate(['welcome'])
    } else {
      if(this.subjectFormGroup.invalid) {
        // triggers contitional for myForm.submitted on html
        return;
      } else {
        if(this.BrojPredmeta.enabled) {
          this.subjectFormGroup.disable();
          this.toastr.success('Pohranili ste novi predmet', 'Uspjeh', {
            progressBar: true
          });
        } else {
          this.router.navigate(['subject', 1])
        }
      }
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
  get DozvoljeniKorisnici(): FormArray {
    return this.subjectFormGroup.get('DozvoljeniKorisnici') as FormArray;
  }
}
