import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartOverviewComponent } from './chart-overview/chart-overview.component';
import { SubjectGuard } from '../shared/services/guards/subject.guard';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'overview',
      component: ChartOverviewComponent,
      canActivate: [SubjectGuard]
    }
  ])],
  exports: [RouterModule]
})
export class ChartRoutingModule { }
