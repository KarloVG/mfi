import { Component, OnInit } from '@angular/core';
import { ModalOpenSubjectComponent } from 'src/app/subject/subject-detail/modal-open-subject/modal-open-subject.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { ToastrService } from 'ngx-toastr';
import { ModalCanDeactivateComponent } from 'src/app/subject/subject-add-or-edit/modal-can-deactivate/modal-can-deactivate.component';
import { LocalStoreSubjectService } from 'src/app/shared/services/local-store-subject.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor(
    private ngbModalService: NgbModal,
    private router: Router,
    private navService: NavigationService,
    private localstoreService: LocalStoreSubjectService,
    private toastrService : ToastrService
  ) { }

  ngOnInit(): void {
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
            this.openFilterModal();
        } else if (result == false) {
          this.toastrService.warning('Stanje predmeta nije pohranjeno', 'Pažnja', {
            progressBar: true
          });
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

  navigateToNewSubject() {
    this.router.navigate(['subject/add']);
  }
}
