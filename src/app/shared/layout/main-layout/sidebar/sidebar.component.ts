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
      path: '/predmet',
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
      path: '/statement-base/overview',
      descr: 'Tablica',
      icon: 'fa-table',
      active: false,
      visible: true,
      disabled: false,
    },
    {
      name: 'grafovi',
      path: '/graphs',
      descr: 'Dijagram',
      icon: 'fa-sitemap',
      active: false,
      visible: true,
      disabled: false,
    },
    {
      name: 'tijek',
      path: '/flow',
      descr: 'Tijek',
      icon: 'fa-clock',
      active: false,
      visible: true,
      disabled: false,
    },
    {
      name: 'mapa',
      path: '/map',
      descr: 'Mapa',
      icon: 'fa-map',
      active: false,
      visible: true,
      disabled: false,
    },
    {
      name: 'graf',
      path: '/chart',
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
