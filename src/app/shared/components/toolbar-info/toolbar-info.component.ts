import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-toolbar-info',
  templateUrl: './toolbar-info.component.html',
  styleUrls: ['./toolbar-info.component.scss']
})
export class ToolbarInfoComponent implements OnInit {

  @Input() moduleName: string;
  @Input() moduleFontIcon;

  constructor() { }

  ngOnInit(): void {
    console.log('MODX', this.moduleName);
  }
}
