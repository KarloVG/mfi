import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {tileLayer, latLng, circle, polygon, marker, circleMarker, polyline, rectangle} from 'leaflet';
import {SubjectService} from 'src/app/shared/services/subject.service'
import {BaseService} from 'src/app/statement-base/services/base.service'
import {untilComponentDestroyed} from '@w11k/ngx-componentdestroyed';
import {MapDataService} from '../services/map-data.service'

import {registerLocaleData} from '@angular/common';
import localeHr from '@angular/common/locales/hr';
registerLocaleData(localeHr, 'hr');

import {countriesLatLng} from '../countries'
import { NgxCaptureService } from 'ngx-capture';
import { BaseToBlobService } from 'src/app/shared/services/base-to-blob-service';

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
  @ViewChild('screen', { static: true }) screen: any;
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
    private captureService: NgxCaptureService,
    private baseToBlobService: BaseToBlobService
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
    header: `<div class="my-1"><strong>{{country}}</strong><hr class="my-1"/></div>`,
    from: `<div class="my-1">
      Ukupno <span class="text-success">isplata</span> iz {{codeFrom}} u {{codeTo}}: <strong>{{ukupnoIsplata}}</strong><br/>
      Ukupan iznos <span class="text-success">isplata</span> iz {{codeFrom}} u {{codeTo}}: <strong>{{iznosIsplata}}</strong>
    </div>`,
    to: `<div class="my-1">
      Ukupno <span class="text-info">uplata</span> iz {{codeTo}} u {{codeFrom}}: <strong>{{ukupnoUplata}}</strong><br/>
      Ukupan iznos <span class="text-info">uplata</span> iz {{codeTo}} u {{codeFrom}}: <strong>{{iznosUplata}}</strong>
    </div>`,
    link: `<div class="my-1">Transakcije {{codeFrom}} &harr; {{codeTo}}: <strong>{{ukupnoTransakcija}}</strong></div>`,
  }

  addUser(osobaId, izvodId) {
    console.log('Init map data', osobaId)
    this.activeUser = { id: osobaId }
    let cmap = {}
    let markers = []
    let markersObj = []
    this.mapSvc.getInitialData(osobaId).pipe(untilComponentDestroyed(this)).subscribe(
      data => {
        console.log('ADX', data)
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
            if (markers.indexOf(cFrom.code) < 0) {
              markerFrom.bindTooltip(cFrom.name)
              markerFrom.addTo(this.map)
              markers.push(cFrom.code)
              markersObj.push({code: cFrom.code, obj: markerFrom})
            }
            if (markers.indexOf(cTo.code) < 0) {
              markerTo.bindTooltip(cTo.name)
              markerTo.addTo(this.map)
              markers.push(cTo.code)
              markersObj.push({code: cTo.code, obj: markerTo})
            }
            link.addTo(this.map)

            //console.log('GIDx', itm)
            let tlx = this.template.link.replace(/{{codeFrom}}/gi, cFrom.code).replace(/{{codeTo}}/gi, cTo.code).replace(/{{ukupnoTransakcija}}/gi, itm.ukupnoUplata + itm.ukupnoIsplata)
            let thdr = this.template.header.replace(/{{country}}/gi, cTo.name)
            let ttxt = thdr
            if (itm.smjer === 'out') {
              ttxt += this.template.from.replace(/{{codeFrom}}/gi, cTo.code).replace(/{{codeTo}}/gi, cFrom.code).replace(/{{ukupnoIsplata}}/gi, itm.ukupnoIsplata).replace(/{{iznosIsplata}}/gi, itm.iznosIsplata)
              cmap[itm.drzavaB].push(ttxt)
            }
            if (itm.smjer === 'in') {
              ttxt += this.template.to.replace(/{{codeFrom}}/gi, cTo.code).replace(/{{codeTo}}/gi, cFrom.code).replace(/{{ukupnoUplata}}/gi, itm.ukupnoUplata).replace(/{{iznosUplata}}/gi, itm.iznosUplata)
              cmap[itm.drzavaB].push(ttxt)
            }
            if (itm.smjer === 'inout') {
              ttxt += this.template.from.replace(/{{codeFrom}}/gi, cFrom.code).replace(/{{codeTo}}/gi, cTo.code).replace(/{{ukupnoIsplata}}/gi, itm.ukupnoIsplata).replace(/{{iznosIsplata}}/gi, itm.iznosIsplata)
              ttxt += this.template.to.replace(/{{codeFrom}}/gi, cTo.code).replace(/{{codeTo}}/gi, cFrom.code).replace(/{{ukupnoUplata}}/gi, itm.ukupnoUplata).replace(/{{iznosUplata}}/gi, itm.iznosUplata)
              cmap[itm.drzavaB].push(ttxt)
            }
            link.bindPopup(tlx)
          })
        })
        Object.getOwnPropertyNames(cmap).forEach(itm => {
          const marker = markersObj.find(mx => { return mx.code === itm })
          marker.obj.bindPopup(cmap[itm].join('<br/>'))
        })
        //console.log('CMPX', cmap)
        //console.log('MRX', markersObj)
      }
    )
  }

  onMapReady(map) {
    this.map = map
    this.isMapReady = true
  }

  markerAtCountry(country) {
    const cdata = this.getCountryData(country)
    const mrk = marker([cdata.lat, cdata.lng])
    mrk.bindTooltip(cdata.name).openTooltip()
    return mrk
  }

  exportPicture(event) {
    if(event) {
      this.captureService.getImage(this.screen.nativeElement, true).then(img => {
        const replaceValue = img.replace('data:image/png;base64,', '');
        const convertedFile = this.baseToBlobService.base64toBlob(replaceValue);
        const url= URL.createObjectURL(convertedFile);
        window.open(url, '_blank');
      });
    }
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
