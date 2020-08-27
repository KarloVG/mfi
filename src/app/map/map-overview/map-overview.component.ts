import {Component, OnInit} from '@angular/core';
import {tileLayer, latLng, circle, polygon, marker, Layer} from 'leaflet';

import {countriesLatLng} from '../countries'

@Component({
  selector: 'app-map-overview',
  templateUrl: './map-overview.component.html',
  styleUrls: ['./map-overview.component.scss']
})
export class MapOverviewComponent implements OnInit {
  moduleName: string = 'Prikaz informacija na mapi';
  moduleFontIcon: string = 'fas fa-map';
  displayType: string = 'map'
  countriesLatLng: any[]

  map
  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
    ],
    zoom: 5,
    center: latLng(45.763081899999996, 15.9966221)
  };

  layersControl = {
    overlays: {
      'Oznake': marker([45.76308, 15.99662])
    }
  }

  // circle([ 45.76308, 15.99662 ], { radius: 5000 })
  // marker([ 46.879966, -121.726909 ]

  zoom: number

  constructor() {
    Object.assign(this, {countriesLatLng})
    console.log('CLX', countriesLatLng)
  }

  ngOnInit(): void {}

  onMapReady(map) {
    this.map = map
    /*
    const layer = Layer.marker(this.markerAtCountry('HR'))
    console.log('LYX', layer)

    this.map.addLayer(layer)
    */

    console.log('LXX', this.map)
  }

  markerAtCountry(country) {
    const cdata = countriesLatLng.find(c => { return c.code === country })
    return marker([cdata.lat, cdata.lng])
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
