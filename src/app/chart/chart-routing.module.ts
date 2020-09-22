import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartOverviewComponent } from './chart-overview/chart-overview.component';
import { SubjectGuard } from '../shared/services/guards/subject.guard';
import { ConfirmExitPopupGuard } from '../shared/services/confirm-exit-popup-guard';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'overview',
      component: ChartOverviewComponent,
      canActivate: [SubjectGuard],
      canDeactivate: [ ConfirmExitPopupGuard ]
    }
  ])],
  exports: [RouterModule]
})
export class ChartRoutingModule { }
