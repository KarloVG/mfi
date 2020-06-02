import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapRoutingModule } from './map-routing.module';
import { MapOverviewComponent } from './map-overview/map-overview.component';


@NgModule({
  declarations: [MapOverviewComponent],
  imports: [
    CommonModule,
    MapRoutingModule
  ]
})
export class MapModule { }
