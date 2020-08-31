import {Component, OnInit, OnDestroy} from '@angular/core';
import {tileLayer, latLng, circle, polygon, marker, circleMarker, polyline, rectangle} from 'leaflet';
import {SubjectService} from 'src/app/shared/services/subject.service'
import {BaseService} from 'src/app/statement-base/services/base.service'
import {untilComponentDestroyed} from '@w11k/ngx-componentdestroyed';
import {MapDataService} from '../services/map-data.service'

import {registerLocaleData} from '@angular/common';
import localeHr from '@angular/common/locales/hr';
registerLocaleData(localeHr, 'hr');

import {countriesLatLng} from '../countries'

@Component({
  selector: 'app-map-overview',
  templateUrl: './map-overview.component.html',
  styleUrls: ['./map-overview.component.scss']
})
export class MapOverviewComponent implements OnInit, OnDestroy {
  moduleName: string = 'Prikaz informacija na mapi';
  moduleFontIcon: string = 'fas fa-map';
  displayType: string = 'map'
  countriesLatLng: any[]

  activeUser: any
  usersList: any[]
  subjectId: number

  dataMap = {}

  map: any
  isMapReady: boolean = false
  zoom: number
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

  polyOpts = {
    smoothFactor: 7,
    weight: 3,
    color: '#444',
    dashArray: '4 6'
  }

  circleOpts = {
    weight: 3,
    fill: true,
    fillOpacity: 0.3,
    fillRule: 'nonzero',
  }
  circleOptsTypes = {
    'out': {color: '#070', fillColor: '#8d8'},    // green
    'in': {color: '#05c', fillColor: '#49f'},     // blue
    'inout': {color: '#900', fillColor: '#d44'},  // red
  }

  constructor(
    private subjectService: SubjectService,
    private baseService: BaseService,
    private mapSvc: MapDataService,
  ) {
    Object.assign(this, {countriesLatLng})
    this.subjectId = +this.subjectService.hasToken()
    this.baseService.getBaseItems().subscribe(
      data => {
        this.usersList = data
      },
      err => {
        console.warn('ERR', err)
      }
    )
  }

  ngOnInit(): void {}

  onChangeOsobaOrIzvod(event): void {
    if (this.isMapReady) {
      this.addUser(event.osobaID, event.izvodID)
    }
  }

  addUser(osobaId, izvodId) {
    console.log('Init map data...')
    this.activeUser = {
      id: osobaId
    }
    this.mapSvc.getInitialData(osobaId).pipe(untilComponentDestroyed(this)).subscribe(
      data => {
        data.forEach(itm => {
          const markerFrom = this.markerAtCountry(itm.firstCountry)
          const markerTo = this.markerAtCountry(itm.secondCountry)
          const link = this.linkCountries(itm.firstCountry, itm.secondCountry)
          markerFrom.addTo(this.map)
          markerTo.addTo(this.map)
          link.addTo(this.map)

          const cFrom = this.getCountryData(itm.firstCountry)
          const cTo = this.getCountryData(itm.secondCountry)

          const tplFrom = '<strong>{{country}}</strong><br/>Ukupno isplata iz {{code}}: <strong>{{brojIsplata}}</strong><br/>Ukupan iznos isplata iz {{code}}: <strong>{{totalIsplata}}</strong>'
          const tplTo = '<strong>{{country}}</strong><br/>Ukupno uplata u {{code}}: <strong>{{brojUplata}}</strong><br/>Ukupan iznos uplata iz {{code}}: <strong>{{totalUplata}}</strong>'
          const tfrom = tplFrom.replace(/{{country}}/gi, cFrom.name).replace(/{{code}}/gi, cFrom.code).replace(/{{brojIsplata}}/gi, itm.brojIsplata).replace(/{{totalIsplata}}/gi, itm.totalIsplata)
          const tto = tplTo.replace(/{{country}}/gi, cTo.name).replace(/{{code}}/gi, cTo.code).replace(/{{brojUplata}}/gi, itm.brojUplata).replace(/{{totalUplata}}/gi, itm.totalUplata)
          console.log('GIDx', itm)
          console.log(' FRMx', tfrom)
          console.log(' TOxx', tto)
          markerFrom.bindPopup(tfrom).openPopup()
          markerTo.bindPopup(tto).openPopup()
          link.bindPopup('Transakcije {{codeFrom}} &harr; {{codeTo}}: <strong>{{brojTransakcija}}</strong>'.replace(/{{codeFrom}}/gi, cFrom.code).replace(/{{codeTo}}/gi, cTo.code).replace(/{{brojTransakcija}}/gi, itm.brojUplata + itm.brojIsplata))//.openPopup()

          //this.dataMap
        })
      }
    )
  }

  onMapReady(map) {
    this.map = map
    this.isMapReady = true

    //const vmk = this.vizualizeCountry('au', 'inout')
    //vmk.addTo(this.map)
  }

  markerAtCountry(country) {
    const cdata = this.getCountryData(country)
    const mrk = marker([cdata.lat, cdata.lng])
    mrk.bindTooltip(cdata.name).openTooltip()
    return mrk
  }

  linkCountries(fromCountry, toCountry) {
    const cFrom = this.getCountryData(fromCountry)
    const cTo = this.getCountryData(toCountry)
    const ply = polyline([cFrom, cTo], this.polyOpts)
    ply.bindTooltip(cFrom.name + ' &harr; ' + cTo.name).openTooltip()
    return ply
  }

  vizualizeCountry(country, type) {
    const cmll = this.getCountryData(country)
    const vcDefaultOpts = {color: '#555', fillColor: '#aaa'}
    let typeOpts = this.circleOptsTypes[type]
    typeOpts = typeOpts? typeOpts : vcDefaultOpts
    const cmk = circle(cmll, {radius: cmll.radius || 100000, ...typeOpts, ...this.circleOpts})
    console.log('VCX', cmll, cmll.radius || 100000, cmk)
    return cmk
  }

  getCountryData(code) {
    return countriesLatLng.find(c => { return c.code === code.toUpperCase() })
  }

  zoomControl(evt) {
    this.zoom = this.map.getZoom()
  }
  mapClick(evt) {
    console.log('CLICK!', evt)
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

  public ngOnDestroy(): void {}
}
