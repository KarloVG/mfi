import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DiagramOverviewComponent } from './diagram-overview/diagram-overview.component';
import { SubjectGuard } from '../shared/services/guards/subject.guard';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'overview',
      component: DiagramOverviewComponent,
      canActivate: [SubjectGuard]
    }
  ])],
  exports: [RouterModule]
})
export class DiagramRoutingModule { }
