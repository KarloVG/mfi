import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-overview',
  templateUrl: './map-overview.component.html',
  styleUrls: ['./map-overview.component.scss']
})
export class MapOverviewComponent implements OnInit {

  moduleName: string = 'Prikaz informacija na mapi';
  moduleFontIcon = 'fas fa-map';

  constructor() { }

  ngOnInit(): void {
  }

}
