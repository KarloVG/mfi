import { Component, OnInit, Input } from '@angular/core';
import { IFilterCriteria } from '../../models/filter-criteria';

@Component({
  selector: 'app-filter-alert',
  templateUrl: './filter-alert.component.html',
  styleUrls: ['./filter-alert.component.scss']
})
export class FilterAlertComponent implements OnInit{


  @Input() storageData: IFilterCriteria;

  constructor() { }

  ngOnInit(): void {
    console.log(this.storageData)
  }

}
