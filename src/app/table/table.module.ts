import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableRoutingModule } from './table-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableOverviewComponent } from './table-overview/table-overview.component';


@NgModule({
  declarations: [
    TableOverviewComponent
  ],
  imports: [
    CommonModule,
    TableRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ]
})
export class TableModule { }
