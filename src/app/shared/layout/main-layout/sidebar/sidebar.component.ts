import { Component, OnInit } from '@angular/core';
import { LocalStoreSubjectService } from 'src/app/shared/services/local-store-subject.service';
import { NavigationService, IMenuItem } from 'src/app/shared/services/navigation.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalOpenSubjectComponent } from 'src/app/subject/subject-detail/modal-open-subject/modal-open-subject.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ModalCanDeactivateComponent } from 'src/app/subject/subject-add-or-edit/modal-can-deactivate/modal-can-deactivate.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  menus: IMenuItem[] = []

  constructor(
    private navService: NavigationService,
    private ngbModalService: NgbModal,
    private router: Router,
    private toastrService: ToastrService,
    private localstoreService: LocalStoreSubjectService
  ) { }

  ngOnInit(): void {
    this.navService.publishNavigationChange();
    this.navService.menuItems$
      .subscribe((items) => {
        this.menus = items;
      });
  }

  navigateToNewSubject() {
    const subjectToken = this.localstoreService.hasToken();
    if (subjectToken) {
      const modalRef = this.ngbModalService.open(ModalCanDeactivateComponent, { backdrop: 'static', keyboard: false });
      modalRef.result.then((result) => {
        if (result == true) {
          this.toastrService.success('Stanje predmeta je pohranjeno', 'Uspjeh', {
            progressBar: true
          });
          localStorage.removeItem('subject_id');
          this.navService.publishNavigationChange();
          this.router.navigate(['subject/add']);
        } else if (result == false) {
          this.toastrService.warning('Stanje predmeta nije pohranjeno', 'Pažnja', {
            progressBar: true
          });
          localStorage.removeItem('subject_id');
          this.navService.publishNavigationChange();
          this.router.navigate(['subject/add']);
        }
      })
    } else {
      this.router.navigate(['subject/add']);
    }
  }

  openSubjectModal(): void {
    const subjectToken = this.localstoreService.hasToken();
    if (subjectToken) {
      const modalRef = this.ngbModalService.open(ModalCanDeactivateComponent, { backdrop: 'static', keyboard: false });
      modalRef.result.then((result) => {
        if (result == true) {
          this.toastrService.success('Stanje predmeta je pohranjeno', 'Uspjeh', {
            progressBar: true
          });
          localStorage.removeItem('subject_id');
          this.navService.publishNavigationChange();
          this.openFilterModal();
        } else if (result == false) {
          this.toastrService.warning('Stanje predmeta nije pohranjeno', 'Pažnja', {
            progressBar: true
          });
          localStorage.removeItem('subject_id');
          this.navService.publishNavigationChange();
          this.openFilterModal();
        }
      })
    } else {
      this.openFilterModal();
    }
  }

  openFilterModal() {
    const modal = this.ngbModalService.open(ModalOpenSubjectComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    modal.result.then(result => {
      if (typeof (result) == 'number') {
        localStorage.setItem('subject_id', result.toString());
        this.navService.publishNavigationChange();
        this.router.navigate(['subject', result.toString()]);
      }
    })
  }

  exitSubject(): void {
    const subjectToken = this.localstoreService.hasToken();
    if (subjectToken) {
      const modalRef = this.ngbModalService.open(ModalCanDeactivateComponent, { backdrop: 'static', keyboard: false });
      modalRef.result.then((result) => {
        if (result == true) {
          this.toastrService.success('Stanje predmeta je pohranjeno', 'Uspjeh', {
            progressBar: true
          });
          localStorage.removeItem('subject_id');
          this.navService.publishNavigationChange();
          this.router.navigate(['welcome']);
        } else if (result == false) {
          this.toastrService.warning('Stanje predmeta nije pohranjeno', 'Pažnja', {
            progressBar: true
          });
          localStorage.removeItem('subject_id');
          this.navService.publishNavigationChange();
          this.router.navigate(['welcome']);
        }
      })
    } else {
      this.toastrService.warning('Ne postoji aktivan predmet','Pažnja');
    }
  }

  saveSubject() {
    const subjectToken = this.localstoreService.hasToken();
    if (subjectToken) {
      this.toastrService.success('Stanje predmeta je pohranjeno', 'Uspjeh', {
        progressBar: true
      });
    } else {
      this.toastrService.warning('Ne postoji aktivan predmet','Pažnja');
    }
  }
}
