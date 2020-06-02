import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FlowOverviewComponent } from './flow-overview/flow-overview.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'overview',
      component: FlowOverviewComponent
    }
  ])],
  exports: [RouterModule]
})
export class FlowRoutingModule { }
