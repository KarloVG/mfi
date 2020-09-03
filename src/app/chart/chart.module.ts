import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartRoutingModule } from './chart-routing.module';
import { ChartOverviewComponent } from './chart-overview/chart-overview.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChartsModule } from 'ng2-charts';
import { NgxCaptureModule } from 'ngx-capture';

@NgModule({
  declarations: [ChartOverviewComponent],
  imports: [
    CommonModule,
    ChartRoutingModule,
    SharedModule,
    ChartsModule,
    NgxCaptureModule
  ],
  exports: [ChartRoutingModule]
})
export class ChartModule {}
