import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BaseOverviewComponent } from './base-overview/base-overview.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'overview',
        component: BaseOverviewComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class StatementBaseRoutingModule { }