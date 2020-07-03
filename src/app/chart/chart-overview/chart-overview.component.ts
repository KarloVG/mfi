import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chart-overview',
  templateUrl: './chart-overview.component.html',
  styleUrls: ['./chart-overview.component.scss']
})
export class ChartOverviewComponent implements OnInit {

  moduleName: string = 'Prikaz informacija na mapi';
  moduleFontIcon = 'fas fa-chart-pie';

  constructor() { }

  ngOnInit(): void {
  }

}
