import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DiagramRoutingModule } from './diagram-routing.module';
import { DiagramOverviewComponent } from './diagram-overview/diagram-overview.component';
import { TopbarComponent } from './topbar/topbar.component';
import { UserviewComponent } from './userview/userview.component';
import { AccountviewComponent } from './accountview/accountview.component';
import { TransactionviewComponent } from './transactionview/transactionview.component';
import { SharedModule } from '../shared/shared.module';
import { ModalTransactionviewDetailComponent } from './transactionview/modal-transactionview-detail/modal-transactionview-detail.component';
import { ModalAccountviewDetailComponent } from './accountview/modal-accountview-detail/modal-accountview-detail.component';

@NgModule({
  declarations: [
    DiagramOverviewComponent, 
    TopbarComponent, 
    UserviewComponent,
    AccountviewComponent,
    TransactionviewComponent,
    ModalTransactionviewDetailComponent,
    ModalAccountviewDetailComponent
  ],
  imports: [
    CommonModule,
    DiagramRoutingModule,
    FormsModule,
    SharedModule,
  ],
  entryComponents: [ ModalTransactionviewDetailComponent, ModalAccountviewDetailComponent ]
})
export class DiagramModule { }
