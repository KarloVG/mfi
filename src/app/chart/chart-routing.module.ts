import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartOverviewComponent } from './chart-overview/chart-overview.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'overview',
      component: ChartOverviewComponent
    }
  ])],
  exports: [RouterModule]
})
export class ChartRoutingModule { }
