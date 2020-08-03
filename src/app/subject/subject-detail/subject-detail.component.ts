import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubjectStatusService } from '../services/subject-status.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { ISimpleDropdownItem } from 'src/app/shared/models/simple-dropdown-item';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectApiService } from '../services/subject.service';
import { ISubject } from '../models/subject';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { ToastrService } from 'ngx-toastr';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { ModalCanDeactivateComponent } from 'src/app/subject/subject-add-or-edit/modal-can-deactivate/modal-can-deactivate.component';

@Component({
  selector: 'app-subject-detail',
  templateUrl: './subject-detail.component.html',
  styleUrls: ['./subject-detail.component.scss']
})
export class SubjectDetailComponent implements OnInit, OnDestroy {

  subjectStatuses: ISimpleDropdownItem[] = [];
  subjectId: number;
  subject: ISubject;

  //temporarily
  subjectStatus: ISimpleDropdownItem;

  constructor(
    private subjectStatusService: SubjectStatusService,
    private activatedRoute: ActivatedRoute,
    private subjectApiService: SubjectApiService,
    private ngbModalService: NgbModal,
    private toastrService: ToastrService,
    private router: Router,
    private navigationService: NavigationService,

    private storeService: SubjectService,
    private navService: NavigationService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(params && params.id) {
        this.subjectId = params.id;
        this.getSubjectById();
      }
    });
  }

  // moramo imati zbog untilComponentDestroyed
  ngOnDestroy(): void {}

  navigateToEdit(): void {
    this.router.navigate(['subject/edit', this.subjectId]);
  }

  deleteSubject() {
    const modalRef = this.ngbModalService.open(ConfirmationModalComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.title = 'Brisanje predmeta';
    modalRef.componentInstance.description = `Jeste li sigurni da želite izbrisati predmet: '${this.subject.nazivPredmeta}' sa brojem predmeta '${this.subject.brojPredmeta}'`
    modalRef.result.then((result) => {
      if (result) {
        this.subjectApiService.deleteSubject(this.subjectId).subscribe(
          data => {
            this.toastrService.success('Obrisali ste predmet', 'Uspjeh');
            localStorage.removeItem('predmetID');
            this.navigationService.publishNavigationChange();
            this.router.navigate(['welcome']);
          }
        );
      } else {
        this.toastrService.warning('Niste izbrisali predmet', 'Pažnja');
      }
    }).catch((res) => { });
  }

  getSubjectStatuses(): void {
    this.subjectStatusService.getSubjectStatuses().pipe(untilComponentDestroyed(this)).subscribe(
      data => {
        this.subjectStatuses = data;
        this.getSubjectById();
      }
    )
  }

  getSubjectById() {
    this.subjectApiService.getSubjectById(this.subjectId).pipe(untilComponentDestroyed(this)).subscribe(
      data => {
        console.log(data)
        this.subject = data;
      },
      err => {
        console.log(err);
        /* ovo maknuti kad stigne backend */
        localStorage.removeItem('predmetID');
        this.navigationService.publishNavigationChange();
        this.router.navigate(['welcome']);
      }
    )
  }

  exitSubject(): void { // here
    const subjectToken = this.storeService.hasToken();
    if (subjectToken) {
      const modalRef = this.ngbModalService.open(ModalCanDeactivateComponent, { backdrop: 'static', keyboard: false });
      modalRef.result.then((result) => {
        if (result == true) {
          this.toastrService.success('Stanje predmeta je pohranjeno', 'Uspjeh', {
            progressBar: true
          });
          localStorage.clear();
          this.navService.publishNavigationChange();
          this.router.navigate(['welcome']);
        } else if (result == false) {
          this.toastrService.warning('Stanje predmeta nije pohranjeno', 'Pažnja', {
            progressBar: true
          });
          localStorage.clear();
          this.navService.publishNavigationChange();
          this.router.navigate(['welcome']);
        }
      })
    } else {
      this.toastrService.warning('Ne postoji aktivan predmet', 'Pažnja');
    }
  }
}
