import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';
import { StatementBaseModule } from './statement-base/statement-base.module';
import { HomeModule } from './home/home.module';
import { SubjectModule } from './subject/subject.module';
import { ChartModule } from './chart/chart.module';
import { DiagramModule } from './diagram/diagram.module';
import { FlowModule } from './flow/flow.module';
import { MapModule } from './map/map.module';
import { TableModule } from './table/table.module';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { CustomPreloader } from './custom-preloader';

const routes: Routes = [
  {
    path: 'welcome',
    component: MainLayoutComponent,
    loadChildren: () => HomeModule
  },
  {
    path: 'subject',
    component: MainLayoutComponent,
    loadChildren: () => SubjectModule,
    data: { preload: true }
  },
  {
    path: 'statement-base',
    component: MainLayoutComponent,
    loadChildren: () => StatementBaseModule,
    data: { preload: true }
  },
  {
    path: 'table',
    component: MainLayoutComponent,
    loadChildren: () => TableModule,
    data: { preload: true }
  },
  {
    path: 'chart',
    component: MainLayoutComponent,
    loadChildren: () => ChartModule
  },
  {
    path: 'diagram',
    component: MainLayoutComponent,
    loadChildren: () => DiagramModule
  },
  {
    path: 'flow',
    component: MainLayoutComponent,
    loadChildren: () => FlowModule
  },
  {
    path: 'map',
    component: MainLayoutComponent,
    loadChildren: () => MapModule
  },
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { 
    path:'**', 
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes , { preloadingStrategy: CustomPreloader })],
  exports: [RouterModule],
  providers: [CustomPreloader]
})
export class AppRoutingModule { }