import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapRoutingModule } from './map-routing.module';
import { MapOverviewComponent } from './map-overview/map-overview.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet'

@NgModule({
  declarations: [MapOverviewComponent],
  imports: [
    CommonModule,
    MapRoutingModule,
    SharedModule,
    LeafletModule
  ]
})
export class MapModule {}
