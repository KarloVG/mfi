import { Component, OnInit } from '@angular/core';
import { ModalOpenSubjectComponent } from 'src/app/subject/subject-detail/modal-open-subject/modal-open-subject.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  constructor(
    private ngbModalService: NgbModal,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  openSubjectModal(): void {
    const modalRef = this.ngbModalService.open(ModalOpenSubjectComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    modalRef.result.then(result => {
      if (result == true) {

      } else {

      }
      // u slucaju da trebamo neki handle
    }).catch((res) => { });
  }

  navigateToNewSubject() {
    this.router.navigate(['subject/add']);
  }
}
