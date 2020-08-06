import { Component, OnInit } from '@angular/core';
import { tileLayer, latLng, circle, polygon } from 'leaflet';

@Component({
  selector: 'app-map-overview',
  templateUrl: './map-overview.component.html',
  styleUrls: ['./map-overview.component.scss']
})
export class MapOverviewComponent implements OnInit {
  moduleName: string = 'Prikaz informacija na mapi';
  moduleFontIcon: string = 'fas fa-map';
  displayType: string = 'map'

  map
  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 9,
    center: latLng(45.763081899999996, 15.9966221)
  };

  layersControl = {
    overlays: {
      'Oznake': circle([ 45.76308, 15.99662 ], { radius: 5000 }),
    }
  }

  zoom: number

  constructor() {}

  ngOnInit(): void {}

  onMapReady(map) {
    this.map = map
  }

  zoomControl(evt) {
    this.zoom = this.map.getZoom()
  }
  mapClick(evt) {
    console.log('CLICK!', evt)
  }

  addUser() {
    console.log('Map', 'addUser')
  }

  expandView() {
    console.log('Map', 'expandViewAction')
    this.zoom = this.map.getZoom()
    this.zoom++
    this.map.setZoom(this.zoom)
  }
  contractView() {
    console.log('Map', 'contractViewAction')
    this.zoom = this.map.getZoom()
    this.zoom--
    this.map.setZoom(this.zoom)
  }

  notifications() {
    console.log('Map', 'notificationsAction')
  }
  filter() {
    console.log('Map', 'filtersAction')
  }
  export() {
    console.log('Map', 'exportAction')
  }
}
