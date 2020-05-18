import { Component, OnInit } from '@angular/core';
import { OVERVIEW_COLUMNS } from '../mock-data/base-overview-columns';

@Component({
  selector: 'app-base-overview',
  templateUrl: './base-overview.component.html',
  styleUrls: ['./base-overview.component.scss']
})
export class BaseOverviewComponent implements OnInit {

  columns: any[] = OVERVIEW_COLUMNS;
  isLoading: boolean = true;
  baseItems: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
