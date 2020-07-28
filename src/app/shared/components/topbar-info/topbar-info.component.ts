import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-topbar-info',
  templateUrl: './topbar-info.component.html',
  styleUrls: ['./topbar-info.component.scss']
})
export class TopbarInfoComponent implements OnInit {

  @Input() moduleName: string;
  @Input() moduleFontIcon;

  constructor() { }

  ngOnInit(): void {
    console.log(this.moduleName);
  }

}
