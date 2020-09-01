import { Component, OnInit, Input } from '@angular/core';
import { LocalStoreSubjectService } from '../../services/local-store-subject.service';
import { ToolbarInfoService } from '../../services/toolbar-info.service';
import { take } from 'rxjs/operators';
import { IToolbarInfo } from '../../models/toolbar-info';

@Component({
  selector: 'app-toolbar-info',
  templateUrl: './toolbar-info.component.html',
  styleUrls: ['./toolbar-info.component.scss']
})
export class ToolbarInfoComponent implements OnInit {

  @Input() moduleName: string;
  @Input() moduleFontIcon;

  dateObject: IToolbarInfo;

  constructor(
    private localSubjectService: LocalStoreSubjectService,
    private toolbarInfoService: ToolbarInfoService
  ) { }

  ngOnInit(): void {
    this.getIzvodTime();
  }

  getIzvodTime() {
    const token = this.localSubjectService.hasToken();
    if(token) {
      this.toolbarInfoService.getToolbarData(token).pipe(take(1)).subscribe(
        data => { this.dateObject = data; console.log(this.dateObject) }
      )
    }
  }
}
