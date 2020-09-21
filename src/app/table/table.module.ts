import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableRoutingModule } from './table-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TableOverviewComponent } from './table-overview/table-overview.component';
import { ExcelService } from '../shared/services/fake-excel.service';
import { ModalTableAlarmComponent } from './table-overview/modal-table-alarm/modal-table-alarm.component';


@NgModule({
  declarations: [
    TableOverviewComponent,
    ModalTableAlarmComponent
  ],
  imports: [
    CommonModule,
    TableRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  entryComponents: [ModalTableAlarmComponent],
  exports: [TableRoutingModule],
  providers: [ExcelService]
})
export class TableModule { }
