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
    smoothFactor: 8,
    weight: 8,
    color: '#444',
    dashArray: '8 12'
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

  template = {
    from: '<div class="mb-1"><strong>{{country}}</strong><br/>Ukupno isplata iz {{code}}: <strong>{{ukupnoIsplata}}</strong><br/>Ukupan iznos isplata iz {{code}}: <strong>{{iznosIsplata}}</strong></div>',
    to: '<div class=""><strong>{{country}}</strong><br/>Ukupno uplata u {{code}}: <strong>{{ukupnoUplata}}</strong><br/>Ukupan iznos uplata iz {{code}}: <strong>{{iznosUplata}}</strong></div>',
    link: '<div>Transakcije {{codeFrom}} &harr; {{codeTo}}: <strong>{{ukupnoTransakcija}}</strong></div>',
  }


  addUser(osobaId, izvodId) {
    console.log('Init map data...', osobaId)
    this.activeUser = {
      id: osobaId
    }
    let cmap = {}
    this.mapSvc.getInitialData(osobaId).pipe(untilComponentDestroyed(this)).subscribe(
      data => {
        //console.log('ADX', data)
        data.forEach(drzava => {
          cmap[drzava.drzava] = []
          //console.log('ADX2', drzava)
          const cFrom = this.getCountryData(drzava.drzava)
          drzava.listaDrzava.forEach(itm => {
            const cTo = this.getCountryData(itm.drzavaB)
            if (!cmap[itm.drzavaB]) {cmap[itm.drzavaB] = []}

            const markerFrom = this.vizualizeCountry(drzava.drzava, itm.smjer)
            const markerTo = this.vizualizeCountry(itm.drzavaB, itm.smjer)
            const link = this.linkCountries(drzava.drzava, itm.drzavaB)
            markerFrom.bindTooltip(cFrom.name).openTooltip()
            markerTo.bindTooltip(cTo.name).openTooltip()
            markerFrom.addTo(this.map)
            markerTo.addTo(this.map)
            link.addTo(this.map)

            let tfrom
            let tto
            let ttxt = ''
            if (itm.smjer === 'out' || itm.smjer === 'inout') {
              //tfrom = this.template.from.replace(/{{country}}/gi, cFrom.name).replace(/{{code}}/gi, cFrom.code).replace(/{{ukupnoIsplata}}/gi, itm.ukupnoIsplata).replace(/{{iznosIsplata}}/gi, itm.iznosIsplata)
              ttxt += this.template.from.replace(/{{country}}/gi, cTo.name).replace(/{{code}}/gi, cTo.code).replace(/{{ukupnoIsplata}}/gi, itm.ukupnoIsplata).replace(/{{iznosIsplata}}/gi, itm.iznosIsplata)
            }
            if (itm.smjer === 'in' || itm.smjer === 'inout') {
              //tto = this.template.to.replace(/{{country}}/gi, cTo.name).replace(/{{code}}/gi, cTo.code).replace(/{{ukupnoUplata}}/gi, itm.ukupnoUplata).replace(/{{iznosUplata}}/gi, itm.iznosUplata)
              ttxt += this.template.to.replace(/{{country}}/gi, cTo.name).replace(/{{code}}/gi, cTo.code).replace(/{{ukupnoUplata}}/gi, itm.ukupnoUplata).replace(/{{iznosUplata}}/gi, itm.iznosUplata)
            }
            let tlx = this.template.link.replace(/{{codeFrom}}/gi, cFrom.code).replace(/{{codeTo}}/gi, cTo.code).replace(/{{ukupnoTransakcija}}/gi, itm.ukupnoUplata + itm.ukupnoIsplata)
            console.log('GIDx', itm)
            //console.log(' - FRMx', tfrom)
            //console.log(' - TOxx', tto)
            cmap[itm.drzavaB].push({
              //from: tfrom,
              //to: tto,
              text: ttxt,
              link: tlx
            })
            //markerFrom.bindPopup(tfrom)
            markerFrom.bindPopup(ttxt)
            //markerTo.bindPopup(tto)
            markerTo.bindPopup(ttxt)
            link.bindPopup(tlx)//.openPopup()
          })
        })
        console.log('CMPX', cmap)
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
    //console.log('VCX', cmll, cmll.radius || 100000, cmk)
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
    //console.log('ZOOM+', this.zoom)
    this.map.setZoom(this.zoom)
  }
  contractView() {
    this.zoom = this.map.getZoom()
    this.zoom--
    if (this.zoom < 2) { this.zoom = 2 }
    //console.log('ZOOM-', this.zoom)
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
