import { Component, OnInit, Input } from '@angular/core';
import { LocalStoreSubjectService } from '../../services/local-store-subject.service';
import { ToolbarInfoService } from '../../services/toolbar-info.service';
import { take } from 'rxjs/operators';
import { IToolbarInfo } from '../../models/toolbar-info';
import { ToastrService } from 'ngx-toastr';

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
    private toolbarInfoService: ToolbarInfoService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getIzvodTime();
  }

  getIzvodTime() {
    const token = this.localSubjectService.hasToken();
    if(token) {
      this.toolbarInfoService.getToolbarData(token).pipe(take(1)).subscribe(
        data => { 
          if(data.maxDate && data.minDate) 
          { 
            this.dateObject = data; 
          } else {
            this.toastr.warning("Predmet ne sadrži izvod", 'Pažnja', {
              progressBar: true,
              timeOut: 5000
            });
          }}
      )
    }
  }
}
