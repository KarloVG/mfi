import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartRoutingModule } from './chart-routing.module';
import { ChartOverviewComponent } from './chart-overview/chart-overview.component';
import { SharedModule } from '../shared/shared.module';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [ChartOverviewComponent],
  imports: [
    CommonModule,
    ChartRoutingModule,
    SharedModule,
    ChartsModule
  ],
  exports: [ChartRoutingModule]
})
export class ChartModule {}
