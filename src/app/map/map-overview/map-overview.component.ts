import {Component, OnInit} from '@angular/core';
import {tileLayer, latLng, circle, polygon, marker, circleMarker, polyline, rectangle} from 'leaflet';

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
  maxZoom: number = 18

  layers = [
    tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: this.maxZoom, attribution: '...' })
  ]

  options = {
    layers: this.layers,
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
  }

  ngOnInit(): void {
  }

  onMapReady(map) {
    this.map = map

    const mrkHr = this.markerAtCountry('HR')
    const mrkDe = this.markerAtCountry('DE')

    mrkHr.bindPopup('Test').openPopup()
    mrkHr.addTo(this.map)
    mrkDe.addTo(this.map)

    const cmll = countriesLatLng.find(c => { return c.code === 'FR' })
    const cmk = circle(cmll, { radius: 10000 * (this.maxZoom - this.map.getZoom()) })
    cmk.bindPopup('Država: <strong>' + cmll.name + '</strong><br/>Broj transakcija: <strong>7</strong>').openPopup()
    cmk.addTo(this.map)

    console.log('LXX', this.map)
  }

  markerAtCountry(country) {
    const cdata = countriesLatLng.find(c => { return c.code === country })
    const mrk = marker([cdata.lat, cdata.lng])
    mrk.bindTooltip(cdata.name).openTooltip()
    return mrk
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
    this.zoom = this.map.getZoom()
    this.zoom++
    if (this.zoom > this.maxZoom) { this.zoom = this.maxZoom }
    console.log('ZOOM+', this.zoom)
    this.map.setZoom(this.zoom)
  }
  contractView() {
    this.zoom = this.map.getZoom()
    this.zoom--
    if (this.zoom < 2) { this.zoom = 2 }
    console.log('ZOOM-', this.zoom)
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
