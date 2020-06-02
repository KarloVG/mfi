import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DiagramOverviewComponent } from './diagram-overview/diagram-overview.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'overview',
      component: DiagramOverviewComponent
    }
  ])],
  exports: [RouterModule]
})
export class DiagramRoutingModule { }
