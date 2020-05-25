import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { OVERVIEW_COLUMNS } from '../mock-data/base-overview-columns';
import { BaseService } from '../services/base.service';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-base-overview',
  templateUrl: './base-overview.component.html',
  styleUrls: ['./base-overview.component.scss']
})
export class BaseOverviewComponent implements OnInit, OnDestroy {

  @ViewChild('myTable') table: any;
  
  columns: any[] = OVERVIEW_COLUMNS;
  isLoading: boolean = true;
  baseItems: any[] = [];

  constructor(
    private baseService: BaseService
  ) { }

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.getBaseItems();
  }

  getBaseItems(): void {
    this.baseService.getBaseExtracts().pipe(untilComponentDestroyed(this)).subscribe(
      data => {
        this.baseItems = data;
        if(data && data.length) {
          data.forEach(element => {
            this.baseItems.push({
              
            })
          })
        }
      }
    )
  }

  onDetailToggle(event): void {
    console.log(event);
  }

  toggleExpandRow(row): void {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

}
