import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MapOverviewComponent } from './map-overview/map-overview.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'overview',
      component: MapOverviewComponent
    }
  ])],
  exports: [RouterModule]
})
export class MapRoutingModule { }
