import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BaseOverviewComponent } from './base-overview/base-overview.component';
import { SubjectGuard } from '../shared/services/guards/subject.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'overview',
        component: BaseOverviewComponent,
        canActivate: [SubjectGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class StatementBaseRoutingModule { }