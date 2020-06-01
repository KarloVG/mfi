import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './main-layout/footer/footer.component';
import { HeaderComponent } from './main-layout/header/header.component';
import { SidebarComponent } from './main-layout/sidebar/sidebar.component';

const components = [
  MainLayoutComponent,
  FooterComponent,
  HeaderComponent,
  SidebarComponent
];

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    RouterModule
  ],
  declarations: components,
  exports: components
})
export class LayoutModule { }
