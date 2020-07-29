import { Component, OnInit } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Graph2d, DataSet } from 'vis'

import { registerLocaleData } from '@angular/common'
import localeHr from '@angular/common/locales/hr'
registerLocaleData(localeHr, 'hr')

import { single } from './data-single'

@Component({
  selector: 'app-chart-overview',
  templateUrl: './chart-overview.component.html',
  styleUrls: ['./chart-overview.component.scss']
})

export class ChartOverviewComponent implements OnInit {
  moduleName: string = 'Prikaz informacija na mapi';
  moduleFontIcon = 'fas fa-chart-pie';

  single = true

  constructor() {
    //Object.assign(this, { single })
  }

  ngOnInit(): void {}
}
