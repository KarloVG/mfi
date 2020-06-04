import { Component, OnInit } from '@angular/core';
import { LocalStoreSubjectService } from 'src/app/shared/services/local-store-subject.service';
import { NavigationService, IMenuItem } from 'src/app/shared/services/navigation.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalOpenSubjectComponent } from 'src/app/subject/subject-detail/modal-open-subject/modal-open-subject.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';



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
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.navService.publishNavigationChange();
    this.navService.menuItems$
      .subscribe((items) => {
        console.log(items)
        this.menus = items;
      });
  }

  openSubjectModal(): void {
    const modalRef = this.ngbModalService.open(ModalOpenSubjectComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    modalRef.result.then(result => {
      if (typeof(result) == 'number') {
        console.log('rezultat', result)
        localStorage.setItem('subject_id', result.toString());
        this.navService.publishNavigationChange();
        this.router.navigate(['subject', result.toString()]);
      }
    }).catch((res) => { });
  }

  exitSubject(): void {
    this.toastrService.info('Predmet je zatvoren')
    localStorage.removeItem('subject_id');
    this.navService.publishNavigationChange();
    this.router.navigate(['welcome']);
  }
}
