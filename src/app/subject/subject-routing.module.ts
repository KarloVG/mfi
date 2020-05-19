import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SubjectDetailComponent } from './subject-detail/subject-detail.component';
import { SubjectAddOrEditComponent } from './subject-add-or-edit/subject-add-or-edit.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'add',
        component: SubjectAddOrEditComponent
      },
      {
        path:'edit/:id',
        component: SubjectAddOrEditComponent
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