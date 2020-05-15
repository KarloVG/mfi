import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubjectPermissionervice } from '../../services/subject-permission.service';
import { take } from 'rxjs/operators';
import { ISubjectPermission } from '../../models/subject-permission';

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
  })

  dataBindingObject: ISubjectPermission;
  filteredSubjectPermissions: ISubjectPermission[] = [];
  subjectPermissions: ISubjectPermission[] = [];
  
  constructor(
    private formBuilder: FormBuilder,
    public modal: NgbActiveModal,
    private subjectPermisssionService: SubjectPermissionervice
  ) { }

  //future backend filtering
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

  selectPermissionUser(event: any, permission: any) {
    this.filteredSubjectPermissions.forEach(
      element => {
        if(element.ID == permission.ID) {
          element.Flag = !element.Flag;
          this.dataBindingObject = element
        } else {
          element.Flag = false;
        }
      }
    )
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
    this.modal.close(this.dataBindingObject);
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
