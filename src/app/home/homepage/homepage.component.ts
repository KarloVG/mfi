import { Component, OnInit } from '@angular/core';
import { ModalOpenSubjectComponent } from 'src/app/subject/subject-detail/modal-open-subject/modal-open-subject.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/shared/services/navigation.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor(
    private ngbModalService: NgbModal,
    private router: Router,
    private navService: NavigationService
  ) { }

  ngOnInit(): void {
  }

  openSubjectModal(): void {
    const modalRef = this.ngbModalService.open(ModalOpenSubjectComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    modalRef.result.then(result => {
      if (typeof(result) == 'number') {
        localStorage.setItem('subject_id', result.toString());
        this.navService.publishNavigationChange();
        this.router.navigate(['subject', result.toString()]);
      }
    }).catch((res) => { });
  }

  navigateToNewSubject() {
    this.router.navigate(['subject/add']);
  }
}
