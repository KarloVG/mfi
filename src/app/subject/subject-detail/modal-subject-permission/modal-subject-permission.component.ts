import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubjectPermissionervice } from '../../services/subject-permission.service';
import { take } from 'rxjs/operators';
import { ISubjectPermission } from '../../models/subject-permission';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-subject-permission',
  templateUrl: './modal-subject-permission.component.html',
  styleUrls: ['./modal-subject-permission.component.scss']
})
export class ModalSubjectPermissionComponent implements OnInit {

  subjectPermisionGroup: FormGroup = this.formBuilder.group({
    Ime: [''],
    Prezime: [''],
    Email: [''],
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
  ) { }

  //future backend filtering - will be refactored when backend comes
  filterUserTable() {
      let searchVal = this.Ime.value.toLowerCase();
      let colsAmt = 10;
      let keys = Object.keys(this.subjectPermissions[0]);
  
      this.filteredSubjectPermissions = this.subjectPermissions.filter(function (item) {
        for (let i = 0; i < colsAmt; i++) {
          if (item[keys[i]] != null && item[keys[i]].toString().toLowerCase().indexOf(searchVal) !== -1 || !searchVal) {
            return true;
          }
        }
      });
  }

  selectPermissionUser(event: MouseEvent, permission: ISubjectPermission) {
    this.filteredSubjectPermissions.forEach(
      element => {
        if(element.ID == permission.ID) {
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
    this.getSubjectPermissions();
  }

  getSubjectPermissions() {
    this.subjectPermisssionService.getPermissions().pipe(take(1)).subscribe(
      data => {
        this.subjectPermissions = data;
      }
    )
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

  get Ime() {
    return this.subjectPermisionGroup.get('Ime');
  }
  get Prezime() {
    return this.subjectPermisionGroup.get('Prezime');
  }
  get Email() {
    return this.subjectPermisionGroup.get('Email');
  }
}
