import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartRoutingModule } from './chart-routing.module';
import { ChartOverviewComponent } from './chart-overview/chart-overview.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [ChartOverviewComponent],
  imports: [
    CommonModule,
    ChartRoutingModule,
    SharedModule
  ],
  exports: [ChartRoutingModule]
})
export class ChartModule { }
