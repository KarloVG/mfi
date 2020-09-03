import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DiagramRoutingModule } from './diagram-routing.module';
import { DiagramOverviewComponent } from './diagram-overview/diagram-overview.component';
import { UserviewComponent } from './userview/userview.component';
import { AccountviewComponent } from './accountview/accountview.component';
import { TransactionviewComponent } from './transactionview/transactionview.component';
import { ModalTransactionviewDetailComponent } from './transactionview/modal-transactionview-detail/modal-transactionview-detail.component';
import { ModalAccountviewDetailComponent } from './accountview/modal-accountview-detail/modal-accountview-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxCaptureModule } from 'ngx-capture';

@NgModule({
  declarations: [
    DiagramOverviewComponent,
    UserviewComponent,
    AccountviewComponent,
    TransactionviewComponent,
    ModalTransactionviewDetailComponent,
    ModalAccountviewDetailComponent,
  ],
  imports: [
    CommonModule,
    DiagramRoutingModule,
    FormsModule,
    SharedModule,
    NgxCaptureModule
  ],
  entryComponents: [ ModalTransactionviewDetailComponent, ModalAccountviewDetailComponent ]
})
export class DiagramModule {}
