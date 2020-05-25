import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SubjectDetailComponent } from './subject-detail/subject-detail.component';
import { SubjectAddOrEditComponent } from './subject-add-or-edit/subject-add-or-edit.component';
import { ConfirmExitPopupGuard } from '../shared/services/confirm-exit-popup-guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'add',
        component: SubjectAddOrEditComponent,
        canDeactivate: [ ConfirmExitPopupGuard ]
      },
      {
        path:'edit/:id',
        component: SubjectAddOrEditComponent,
        canDeactivate: [ ConfirmExitPopupGuard ]
      },
      {
        path: ':id',
        component: SubjectDetailComponent
      },
    ])
  ],
  exports: [RouterModule]
})
export class SubjectRoutingModule { }