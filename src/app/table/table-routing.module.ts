import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableOverviewComponent } from './table-overview/table-overview.component';
import { SubjectGuard } from '../shared/services/guards/subject.guard';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'overview',
      component: TableOverviewComponent,
      canActivate: [SubjectGuard]
    }
  ])],
  exports: [RouterModule]
})
export class TableRoutingModule { }
