import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubjectPermissionervice } from '../../services/subject-permission.service';
import { take } from 'rxjs/operators';
import { ISubjectPermission } from '../../models/subject-permission';
import { ToastrService } from 'ngx-toastr';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-modal-subject-permission',
  templateUrl: './modal-subject-permission.component.html',
  styleUrls: ['./modal-subject-permission.component.scss']
})
export class ModalSubjectPermissionComponent implements OnInit, OnDestroy {

  subjectPermisionGroup: FormGroup = this.formBuilder.group({
    ime: [''],
    prezime: [''],
    loginName: [''],
    isFromAd: [false],
  });

  isAdalSearchActive: boolean = false;
  dataBindingObject: ISubjectPermission;
  filteredSubjectPermissions: ISubjectPermission[] = [];
  subjectPermissions: ISubjectPermission[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public modal: NgbActiveModal,
    private subjectPermisssionService: SubjectPermissionervice,
    private toastr: ToastrService
  ) {}

  filterUserTable() {
    this.subjectPermisssionService.getPermissions(this.subjectPermisionGroup.value)
    .pipe(untilComponentDestroyed(this)).subscribe(
      data => {
        this.filteredSubjectPermissions = data;
      }
    )
  }

  selectPermissionUser(event: MouseEvent, permission: ISubjectPermission) {
    this.filteredSubjectPermissions.forEach(
      element => {
        if(element.korisnikID == permission.korisnikID) {
          element.Flag = true;
          this.dataBindingObject = element;
        } else {
          element.Flag = false;
        }
      }
    )
  }

  onSelectAdalSearch(event: MouseEvent) {
    if(event && event.target) {
      const htmlCheckbox = event.target as HTMLInputElement;
      this.isAdalSearchActive = htmlCheckbox.checked;
    }
  }

  method2(event: MouseEvent, permission: ISubjectPermission) {
    this.dataBindingObject = permission;
    this.onSubmit();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  onSubmit() {
    if(this.dataBindingObject) {
      this.modal.close(this.dataBindingObject);
    } else {
      this.toastr.warning('Korisnik nije odabran', 'Pažnja',{
        progressBar: true
      })
    }
  }

  get ime() {
    return this.subjectPermisionGroup.get('ime');
  }
  get prezime() {
    return this.subjectPermisionGroup.get('prezime');
  }
  get loginName() {
    return this.subjectPermisionGroup.get('loginName');
  }
}
