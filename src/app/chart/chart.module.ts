import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartRoutingModule } from './chart-routing.module';
import { ChartOverviewComponent } from './chart-overview/chart-overview.component';


@NgModule({
  declarations: [ChartOverviewComponent],
  imports: [
    CommonModule,
    ChartRoutingModule
  ]
})
export class ChartModule { }
