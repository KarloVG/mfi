import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core'
import {Network, DataSet, Node, Edge, IdType} from 'vis'
import {DiagramService} from 'src/app/shared/services/diagram.service'
import {NgbModal} from '@ng-bootstrap/ng-bootstrap'
import {SubjectService} from 'src/app/shared/services/subject.service'
import {BaseService} from 'src/app/statement-base/services/base.service'
import {untilComponentDestroyed} from '@w11k/ngx-componentdestroyed'
import {ModalBaseDetailComponent} from 'src/app/statement-base/base-overview/modal-base-detail/modal-base-detail.component'
import { NgxCaptureService } from 'ngx-capture';
import { BaseToBlobService } from 'src/app/shared/services/base-to-blob-service'
import { ModalCanClearViewComponent } from 'src/app/shared/components/modal-can-clearview/modal-can-clearview.component';

import {registerLocaleData} from '@angular/common'
import localeHr from '@angular/common/locales/hr'
import { ToastrService } from 'ngx-toastr'
registerLocaleData(localeHr, 'hr')

interface Users {
  osobaID: string
  naziv: string
  idBroj: string
  label?: string
  totalIn?: number
  totalOut?: number
}

@Component({
  selector: 'app-diagram-overview',
  templateUrl: './diagram-overview.component.html',
  styleUrls: ['./diagram-overview.component.scss']
})
export class DiagramOverviewComponent implements OnInit, OnDestroy {
  @ViewChild('screen', { static: true }) screen: any;

  nodes: Node = new DataSet([])
  edges: Edge = new DataSet([])
  network: Network
  options = {
    physics: {
      barnesHut: {
        gravitationalConstant: -8000,
        centralGravity: 0.01,
        springLength: 200,
        springConstant: 0.1,
        damping: 0.1
      },
      repulsion: {
        centralGravity: -8000,
        springLength: 200,
        springConstant: 0.1,
        nodeDistance: 5000,
        damping: 0.01
      },
      hierarchicalRepulsion: {
        centralGravity: -8000,
        springLength: 1500,
        springConstant: 0.1,
        nodeDistance: 5000,
        damping: 0.01
      }
    }
  }
  data: any
  nodeActive: any = null
  edgeActive: any = null

  activeUser: any
  usersList: any[]
  expanded = new DataSet([])
  isSelectedActiveUser: boolean = false

  viewLevel = 1
  moduleName: string = 'Dijagram financijskih transakcija'
  moduleFontIcon: string = 'fas fa-sitemap'
  displayType: string = 'diagram'

  subjectId: number;

  public constructor(
    private diaSvc: DiagramService,
    private ngbModalService: NgbModal,
    private captureService: NgxCaptureService,
    private baseToBlobService: BaseToBlobService,
    private toastr: ToastrService
  ) {
    // this.subjectId = +this.subjectService.hasToken()
    // this.baseService.getBaseItems().subscribe(
    //   data => {
    //     this.usersList = data
    //   },
    //   err => {
    //     console.warn('ERR', err)
    //   }
    // )
  }

  public ngOnInit(): void {
    const container = document.getElementById('network')
    this.data = {
      nodes: this.nodes,
      edges: this.edges
    }
    this.network = new Network(container, this.data, this.options)

    this.network.on('deselectNode', ctx => { this.deselectNode(ctx) })
    this.network.on('deselectEdge', ctx => { this.deselectEdge(ctx) })
    this.network.on('dragEnd', ctx => { this.selectNode(ctx) })
    this.network.on('click', ctx => { this.inspectNode(ctx) })
    this.network.on('doubleClick', ctx => { this.expandNode(ctx) })

    this.diaSvc.assignNetwork(this.network, this.data, this.nodes, this.edges)
  }
  public ngOnDestroy(): void {}

  selectNode(ctx) {
    this.nodeActive = null
    let idx = ctx.nodes[0]
    this.edgeActive = null
    this.nodeActive = this.nodes.get(idx)
    console.log('SN[%s]', this.nodeActive.type, this.nodeActive, this.nodeActive.id, this.activeUser.id)
    if (this.nodeActive.type === 'user') {
      this.isSelectedActiveUser = this.nodeActive.id === this.activeUser.id
      this.nodeActive.id = this.nodeActive.id.replace(/(connectedAccount\d{1,})$/gi, '')
    } else if (this.nodeActive.type === 'account' || this.nodeActive.type === 'connectedAccount') {
      if (this.nodeActive.type === 'connectedAccount') {
        this.diaSvc.getDiagramAccountDetail(this.nodeActive.listaIzvoda, this.nodeActive.label).pipe(untilComponentDestroyed(this)).subscribe(
          data => {
            //console.log('GDADx', data)
            this.nodeActive.data = data
          }
        )
      }
      this.isSelectedActiveUser = false
    }
  }
  deselectNode(ctx) {
    this.nodeActive = null
    this.edgeActive = null
    this.isSelectedActiveUser = false
  }
  controlNodeDragEnd(ctx) {}

  selectEdge(ctx) {
    let idx = ctx.edges[0]
    this.nodeActive = null
    this.edgeActive = null
    this.isSelectedActiveUser = false
    if (idx) {
      let edge = this.edges.get(idx)
      //console.log('SE', edge)
      if (edge.type !== 'accountOwner') {
        this.edgeActive = this.diaSvc.getTransactions(edge)
      }
    }
  }
  deselectEdge(ctx) {
    this.nodeActive = null
    this.edgeActive = null
    this.isSelectedActiveUser = false
  }

  addUser(userId, typeId) {
    //console.log('ADX', userId, typeId)
    if (this.nodes.length > 0 || this.edges.length > 0) {
      // alert for cleanup!
      const modalRef = this.ngbModalService.open(ModalCanClearViewComponent, { backdrop: 'static', keyboard: false });
      modalRef.result.then((result) => {
        if (result == true) {
          return false
        } else if (result == false) {
          this.clearNetwork()
          this.setupNewDiagram(userId, typeId)
        }
      })
    } else {
      this.setupNewDiagram(userId, typeId)
    }
  }

  setupNewDiagram(userId, typeId) {
    this.diaSvc.getDiagramData(userId, typeId).pipe(untilComponentDestroyed(this)).subscribe(
      data => {
        if(Object.keys(data.nodes).length === 0 && data.nodes.constructor === Object && Object.keys(data.edges).length === 0 && data.edges.constructor === Object) {
          this.toastr.warning('Ne postoje rezultati prema zadanim parametrima pretrage', 'Pažnja', {
            progressBar: true
          });
        }
        //console.log('DDX', data)
        let payload = this.transformNodesEdges(data)

        const dataContainer = payload.nodes.find(itm => { return itm.hasOwnProperty('data') })

        payload.nodes.forEach(itm => { // replace with map
          const izvod = dataContainer.data.izvodi.find(iz => { return iz.brojRacuna === itm.label })
          const osoba = itm.hasOwnProperty('data')
          if (izvod) { itm.data = izvod }
          if (osoba) { itm.label = itm.label.replace(/\s\(/gi, '\r\n(') }
        })

        this.nodes.add(payload.nodes)
        this.edges.add(payload.edges)

        this.activeUser = dataContainer
        this.isSelectedActiveUser = false
      }
    )
  }

  transformNodesEdges(data) {
    const nk = Object.getOwnPropertyNames(data.nodes)
    const ek = Object.getOwnPropertyNames(data.edges)
    let nodes = []
    let edges = []
    nk.forEach(key => { nodes.push(data.nodes[key]) })
    ek.forEach(key => { edges.push(data.edges[key]) })
    return {
      nodes: nodes,
      edges: edges
    }
  }

  onChangeOsobaOrIzvod(event): void {
    this.addUser(event.osobaID, event.izvodID)
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

  clearNetwork() {
    this.edges.remove(this.edges.get())
    this.nodes.remove(this.nodes.get())
    this.isSelectedActiveUser = false
  }

  inspectNode(ctx) {
    if (ctx.nodes.length) { // is node
      this.selectNode(ctx)
    } else { // is edge
      this.selectEdge(ctx)
    }
  }

  expandNode(ctx) {
    if (ctx.nodes.length) {
      const nidx = ctx.nodes[0]
      const node = this.nodes.get(nidx)
      if (node.type === 'account') {
        console.log('EXPAND[%s]', node.type, node, this.expanded.get(node.id) === null)
        if (this.expanded.get(node.id) === null) {
          const izvodId = 0
          this.diaSvc.getExpandData(this.activeUser.id, izvodId, node.label, node.id).pipe(untilComponentDestroyed(this)).subscribe(
            data => {
              console.log(data.nodes, data.edges)
              if(Object.keys(data.nodes).length === 0 && data.nodes.constructor === Object && Object.keys(data.edges).length === 0 && data.edges.constructor === Object) {
                this.toastr.warning('Ne postoje rezultati prema zadanim parametrima pretrage', 'Pažnja', {
                  progressBar: true
                });
              }
              //console.log('ENX', data)
              let payload = this.transformNodesEdges(data)
              this.expanded.add(node)

              this.nodes.add(payload.nodes)
              this.edges.add(payload.edges)
            }
          )
        }
      } else if (node.type === 'user') {
        if (node.personIdentificator) {
          const idParts = node.id.split(';')
          console.log('IPX', idParts, idParts.length, idParts[idParts.length - 1])
          if (idParts && idParts.length === 3) { // It works just fine™!
            const brojRacuna = idParts[idParts.length - 1]
            //console.log('USRx', node, node.personIdentificator, brojRacuna, node.id)
            this.diaSvc.getExpandUserData(node.personIdentificator, brojRacuna, node.id).pipe(untilComponentDestroyed(this)).subscribe(
              data => {
                if(Object.keys(data.nodes).length === 0 && data.nodes.constructor === Object && Object.keys(data.edges).length === 0 && data.edges.constructor === Object) {
                  this.toastr.warning('Ne postoje rezultati prema zadanim parametrima pretrage', 'Pažnja', {
                    progressBar: true
                  });
                }
                //console.log('ENX', data)
                let payload = this.transformNodesEdges(data)
                this.expanded.add(node)

                this.nodes.add(payload.nodes)
                this.edges.add(payload.edges)
              }
            )
          }
        }
      }
    }
  }

  onClosed() {
    this.nodeActive = null
    this.edgeActive = null
    this.isSelectedActiveUser = false
    this.network.unselectAll()
  }

  expandView() {
    this.viewLevel++
  }
  contractView() {
    this.viewLevel--
    if (this.viewLevel < 0) { this.viewLevel = 0 }
  }

  rndmm(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  notifications() {
    console.log('Diagram', 'notificationsAction')
  }
  filter() {
    console.log('Diagram', 'filtersAction')
  }
  export() {
    console.log('Diagram', 'exportAction')
  }
}
