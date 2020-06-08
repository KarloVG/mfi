import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MapOverviewComponent } from './map-overview/map-overview.component';
import { SubjectGuard } from '../shared/services/guards/subject.guard';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'overview',
      component: MapOverviewComponent,
      canActivate: [SubjectGuard]
    }
  ])],
  exports: [RouterModule]
})
export class MapRoutingModule { }
