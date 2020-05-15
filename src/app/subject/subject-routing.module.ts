import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SubjectDetailComponent } from './subject-detail/subject-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'add',
        component: SubjectDetailComponent
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