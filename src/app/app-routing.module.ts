import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/layout/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: 'welcome',
    component: MainLayoutComponent,
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }