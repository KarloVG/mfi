import { Component, OnInit } from '@angular/core';
import { SubjectService } from 'src/app/shared/services/subject.service';
import { NavigationService, IMenuItem } from 'src/app/shared/services/navigation.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalOpenSubjectComponent } from 'src/app/subject/subject-detail/modal-open-subject/modal-open-subject.component';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ModalCanDeactivateComponent } from 'src/app/subject/subject-add-or-edit/modal-can-deactivate/modal-can-deactivate.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  menus: IMenuItem[] = []
  isDisabledDropdown: boolean = false;
  constructor(
    private navService: NavigationService,
    private ngbModalService: NgbModal,
    private router: Router,
    private toastrService: ToastrService,
    private storeService: SubjectService,
    private aRoute: ActivatedRoute
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let withNoDigits = event.url.replace(/[0-9]/g, '');
        console.log(withNoDigits)
        if(withNoDigits == '/subject//edit' || withNoDigits == '/subject/add' || withNoDigits == '/welcome') {
          this.isDisabledDropdown = true;
        } else {
          this.isDisabledDropdown = false;
        }
      }
    });
  }

  navigateToPath(path) {
    if(this.isDisabledDropdown == false) {
      this.router.navigate([path])
    }
  } 

  ngOnInit(): void {
    this.navService.publishNavigationChange();
    this.navService.menuItems$
      .subscribe((items) => {
        this.menus = items;
      });

  }

  checkForSubject() {
    console.log('cFS-RCx', this.aRoute.routeConfig);
    console.log('cFS-RUX', this.router.url)
  }

  navigateToNewSubject() {
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
          this.router.navigate(['subject/add']);
        } else if (result == false) {
          this.toastrService.warning('Stanje predmeta nije pohranjeno', 'Pažnja', {
            progressBar: true
          });
          localStorage.clear();
          this.navService.publishNavigationChange();
          this.router.navigate(['subject/add']);
        }
      })
    } else {
      this.router.navigate(['subject/add']);
    }
  }

  openSubjectModal(): void {
    const subjectToken = this.storeService.hasToken();
    if (subjectToken) {
      const modalRef = this.ngbModalService.open(ModalCanDeactivateComponent, { backdrop: 'static', keyboard: false });
      modalRef.result.then((result) => {
        if (result == true || result == false) {
          if(result == true) {
            this.toastrService.success('Stanje predmeta je pohranjeno', 'Uspjeh', {
              progressBar: true
            });
          } else {
            this.toastrService.warning('Stanje predmeta nije pohranjeno', 'Pažnja', {
              progressBar: true
            });
          }
          this.router.navigate(['welcome']);
          localStorage.clear();
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

  saveSubject() {
    const subjectToken = this.storeService.hasToken();
    if (subjectToken) {
      this.toastrService.success('Stanje predmeta je pohranjeno', 'Uspjeh', {
        progressBar: true
      });
    } else {
      this.toastrService.warning('Ne postoji aktivan predmet', 'Pažnja');
    }
  }
}
