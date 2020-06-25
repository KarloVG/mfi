import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiagramRoutingModule } from './diagram-routing.module';
import { DiagramOverviewComponent } from './diagram-overview/diagram-overview.component';
import { TopbarComponent } from './topbar/topbar.component';
import { UserviewComponent } from './userview/userview.component';
import { AccountviewComponent } from './accountview/accountview.component';


@NgModule({
  declarations: [DiagramOverviewComponent, TopbarComponent, UserviewComponent, AccountviewComponent],
  imports: [
    CommonModule,
    DiagramRoutingModule
  ]
})
export class DiagramModule { }
