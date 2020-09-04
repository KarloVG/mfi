import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {tileLayer, latLng, circle, polygon, marker, circleMarker, polyline, rectangle} from 'leaflet';
import {SubjectService} from 'src/app/shared/services/subject.service'
import {BaseService} from 'src/app/statement-base/services/base.service'
import {NgbModal} from '@ng-bootstrap/ng-bootstrap'
import {ModalBaseDetailComponent} from 'src/app/statement-base/base-overview/modal-base-detail/modal-base-detail.component'
import {untilComponentDestroyed} from '@w11k/ngx-componentdestroyed';
import {MapDataService} from '../services/map-data.service'

import {registerLocaleData} from '@angular/common';
import localeHr from '@angular/common/locales/hr';
registerLocaleData(localeHr, 'hr');

import {countriesLatLng} from '../countries'
import { NgxCaptureService } from 'ngx-capture';
import { BaseToBlobService } from 'src/app/shared/services/base-to-blob-service';
import domtoimage from 'dom-to-image';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-map-overview',
  templateUrl: './map-overview.component.html',
  styleUrls: ['./map-overview.component.scss']
})
export class MapOverviewComponent implements OnInit, OnDestroy {
  @ViewChild('screen', { static: true }) screen: any;

  moduleName: string = 'Prikaz informacija na mapi';
  moduleFontIcon: string = 'fas fa-map';
  displayType: string = 'map'

  countriesLatLng: any[]
  activeUser: any
  usersList: any[]
  subjectId: number

  dataMap = {}
  rawData = []

  map: any
  isMapReady: boolean = false
  zoom: number
  maxZoom: number = 18

  layers = [
    tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: this.maxZoom, attribution: '...' })
  ]

  options = {
    layers: this.layers,
    zoom: 3,
    center: latLng(45.763081899999996, 15.9966221)
  };

  layersControl = {
    overlays: {
      'Oznake': marker([45.76308, 15.99662])
    }
  }

  polyOpts = {
    smoothFactor: 8,
    weight: 6,
    color: '#444',
    //dashArray: '8 12'
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
    private ngbModalService: NgbModal
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
    link: `<div class="m-2">
      Transakcije {{codeFrom}} &harr; {{codeTo}}: <strong>{{ukupnoTransakcija}}</strong>
    </div>`,
  }

  addUser(osobaId, izvodId) {
    console.log('Init map data', osobaId)
    this.activeUser = { id: osobaId }
    let cmap = {}
    let markers = []
    let markersObj = []
    this.mapSvc.getInitialData(osobaId).pipe(untilComponentDestroyed(this)).subscribe(
      data => {
        this.rawData = data
        console.log('ADX', this.rawData)
        data.forEach(drzava => {
          cmap[drzava.drzava] = []
          //console.log('ADX2', drzava)
          const cFrom = this.getCountryData(drzava.drzava)
          drzava.listaDrzava.forEach(itm => {
            const cTo = this.getCountryData(itm.drzavaB)
            if (!cmap[itm.drzavaB]) {cmap[itm.drzavaB] = []}

            const markerFrom = this.vizualizeCountry(drzava.drzava, itm.smjer)
            const markerTo = this.vizualizeCountry(itm.drzavaB, itm.smjer)
            const link = this.linkCountries(drzava.drzava, itm.drzavaB, 'Transakcije ', ': <strong>' + (itm.ukupnoUplata + itm.ukupnoIsplata) + '</strong>', 'code')
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
          })
        })
        Object.getOwnPropertyNames(cmap).forEach(itm => {
          const marker = markersObj.find(mx => { return mx.code === itm })
          marker.obj.bindPopup(cmap[itm].join('<br/>'))
        })
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
    domtoimage.toJpeg(document.getElementById('screen'), { quality: 0.95 })
    .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'mapa_' + formatDate(new Date(), 'dd-MM-yyyy', 'hr');;
        link.href = dataUrl;
        link.click();
    });
  }

  linkCountries(fromCountry, toCountry, textPre = null, textPost = null, type:string = 'name') {
    const cFrom = this.getCountryData(fromCountry)
    const cTo = this.getCountryData(toCountry)
    const ply = polyline([cFrom, cTo], this.polyOpts)
    ply.bindTooltip((textPre? textPre : '') + cFrom[type] + ' &harr; ' + cTo[type] + (textPost? textPost : '')).openTooltip()
    ply.on('click', evt => { this.tooltipHandler(evt, this.rawData)})
    //console.log('Poly [%s]-[%s] center:', cFrom.code, cTo.code, ply.getCenter())
    return ply
  }

  tooltipHandler(evt, rawData) {
    const tooltipText = evt.target._tooltip._content
    const rgx = new RegExp('^[T\\w\\s]{1,}([A-Z]{2})\\s\\&harr;\\s([A-Z]{2})[:\\s<>a-z0-9/]{1,}', 'gi')
    const res = rgx.exec(tooltipText)
    if (res[1] && res[2]) {
      let drzavaData = rawData.find(itm => { return itm.drzava === res[1] })
      let transData = drzavaData.listaDrzava.find(itm => { return itm.drzavaB === res[2] })
      this.baseService.getIzvodByList(transData.listaIzvodID).pipe(untilComponentDestroyed(this)).subscribe(
        data => {
          this.showTransactionDetails(data.filter(itm => { return itm.a_FID === res[2] || itm.b_FID === res[2] }))
          this.expandView()
          this.contractView()
        }
      )
    }
  }

  vizualizeCountry(country, type) {
    const countryData = this.getCountryData(country)
    const vcDefaultOpts = {color: '#555', fillColor: '#aaa'}
    let typeOpts = this.circleOptsTypes[type]
    typeOpts = typeOpts? typeOpts : vcDefaultOpts
    const circleViz = circle(countryData, {radius: countryData.radius || 100000, ...typeOpts, ...this.circleOpts})
    return circleViz
  }

  getCountryData(code) {
    return countriesLatLng.find(c => { return c.code === code.toUpperCase() })
  }

  zoomControl(evt) {
    this.zoom = this.map.getZoom()
  }
  mapClick(evt) {}

  expandView() {
    this.zoom = this.map.getZoom()
    this.zoom++
    if (this.zoom > this.maxZoom) { this.zoom = this.maxZoom }
    this.map.setZoom(this.zoom)
  }
  contractView() {
    this.zoom = this.map.getZoom()
    this.zoom--
    if (this.zoom < 2) { this.zoom = 2 }
    this.map.setZoom(this.zoom)
  }

  showTransactionDetails(izvod): void {
    const modalRef = this.ngbModalService.open(ModalBaseDetailComponent, { size: 'xl', backdrop: 'static', keyboard: false, windowClass: 'largeModalClass' });
    modalRef.componentInstance.izvod = izvod
    modalRef.componentInstance.isMap = true
    //console.log('REF', modalRef)
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
