import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableOverviewComponent } from './table-overview/table-overview.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'overview',
      component: TableOverviewComponent
    }
  ])],
  exports: [RouterModule]
})
export class TableRoutingModule { }
