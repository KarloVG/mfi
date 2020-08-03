import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FlowOverviewComponent } from './flow-overview/flow-overview.component';
import { SubjectGuard } from '../shared/services/guards/subject.guard';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'overview',
      component: FlowOverviewComponent,
      canActivate: [SubjectGuard]
    }
  ])],
  exports: [RouterModule]
})
export class FlowRoutingModule { }
