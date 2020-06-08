import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SubjectDetailComponent } from './subject-detail/subject-detail.component';
import { SubjectAddOrEditComponent } from './subject-add-or-edit/subject-add-or-edit.component';
import { ConfirmExitPopupGuard } from '../shared/services/confirm-exit-popup-guard';
import { SubjectGuard } from '../shared/services/guards/subject.guard';

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
        canActivate: [SubjectGuard],
        canDeactivate: [ ConfirmExitPopupGuard ]
      },
      {
        path: ':id',
        component: SubjectDetailComponent,
        canActivate: [SubjectGuard],
      },
    ])
  ],
  exports: [RouterModule]
})
export class SubjectRoutingModule { }