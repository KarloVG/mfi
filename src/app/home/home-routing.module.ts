import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: HomepageComponent
      },
    ])
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
