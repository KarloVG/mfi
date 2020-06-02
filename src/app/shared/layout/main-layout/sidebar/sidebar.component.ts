import { Component, OnInit } from '@angular/core';

interface menu_item {
  name: string
  path: string
  descr: string
  icon: string
  active?: boolean
  visible?: boolean
  disabled: boolean
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public menus = [
    {
      name: 'predmet',
      path: '/subject/edit/1',
      descr: 'Predmet',
      icon: 'fa-folder-open',
      active: false,
      visible: true,
      disabled: false,
    },
    {
      name: 'izvodi',
      path: '/statement-base/overview',
      descr: 'Baza izvoda',
      icon: 'fa-database',
      active: false,
      visible: true,
      disabled: false,
    },
    {
      name: 'tablice',
      path: '/table/overview',
      descr: 'Tablica',
      icon: 'fa-table',
      active: false,
      visible: true,
      disabled: false,
    },
    {
      name: 'grafovi',
      path: '/diagram/overview',
      descr: 'Dijagram',
      icon: 'fa-sitemap',
      active: false,
      visible: true,
      disabled: false,
    },
    {
      name: 'tijek',
      path: '/flow/overview',
      descr: 'Tijek',
      icon: 'fa-clock',
      active: false,
      visible: true,
      disabled: false,
    },
    {
      name: 'mapa',
      path: '/map/overview',
      descr: 'Mapa',
      icon: 'fa-map',
      active: false,
      visible: true,
      disabled: false,
    },
    {
      name: 'graf',
      path: '/chart/overview',
      descr: 'Graf',
      icon: 'fa-chart-pie',
      active: false,
      visible: true,
      disabled: false,
    },
  ]

  constructor() {}

  ngOnInit(): void {}
}
