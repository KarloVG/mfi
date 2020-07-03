import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flow-overview',
  templateUrl: './flow-overview.component.html',
  styleUrls: ['./flow-overview.component.scss']
})
export class FlowOverviewComponent implements OnInit {

  moduleName: string = 'Vremenski tijek transakcija';
  moduleFontIcon = 'fas fa-clock';

  constructor() { }

  ngOnInit(): void {
  }

}
