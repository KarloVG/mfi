import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FlowOverviewComponent } from './flow-overview/flow-overview.component';
import { SubjectGuard } from '../shared/services/guards/subject.guard';
import { ConfirmExitPopupGuard } from '../shared/services/confirm-exit-popup-guard';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'overview',
      component: FlowOverviewComponent,
      canActivate: [SubjectGuard],
      canDeactivate: [ ConfirmExitPopupGuard ]
    }
  ])],
  exports: [RouterModule]
})
export class FlowRoutingModule { }
