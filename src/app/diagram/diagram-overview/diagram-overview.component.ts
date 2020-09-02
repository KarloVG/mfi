import {Component, OnInit, OnDestroy} from '@angular/core'
import {Network, DataSet, Node, Edge, IdType} from 'vis'
import {DiagramService} from 'src/app/shared/services/diagram.service'
import {SubjectService} from 'src/app/shared/services/subject.service'
import {BaseService} from 'src/app/statement-base/services/base.service'
import {untilComponentDestroyed} from '@w11k/ngx-componentdestroyed';

import {registerLocaleData} from '@angular/common';
import localeHr from '@angular/common/locales/hr';
registerLocaleData(localeHr, 'hr');

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
  nodes: Node = new DataSet([])
  edges: Edge = new DataSet([])
  network: Network
  options = {}
  data: any
  nodeActive: any = null
  edgeActive: any = null

  activeUser: any
  usersList: any[]
  expanded = new Set([])
  isSelectedActiveUser: boolean = false

  viewLevel = 1
  moduleName: string = 'Dijagram financijskih transakcija'
  moduleFontIcon: string = 'fas fa-sitemap'
  displayType: string = 'diagram'

  subjectId: number

  public constructor(
    private diaSvc: DiagramService,
    private subjectService: SubjectService,
    private baseService: BaseService,
  ) {
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
    console.log('SNX[%s]', this.nodeActive.type, this.nodeActive, this.nodeActive.id, this.activeUser.id)
    if (this.nodeActive.type === 'user') {
      this.isSelectedActiveUser = this.nodeActive.id === this.activeUser.id
      this.nodeActive.id = this.nodeActive.id.replace(/(connectedAccount\d{1,})$/gi, '')
    } else if (this.nodeActive.type === 'account' || this.nodeActive.type === 'connectedAccount') {
      if (this.nodeActive.type === 'connectedAccount') {
        this.nodeActive.data = {
          brojRacuna: this.nodeActive.label? this.nodeActive.label : this.nodeActive.id,
          swift: null,
          banka: null,
          brojIsplata: null,
          brojUplata: null,
          iznosIsplata: null,
          iznosUplata: null,
          brojTransakcija: null,
        }
      }
      console.log('CNX')
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
      console.log('EGX', edge)
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
    console.log('ADX', userId, typeId)
    if (this.nodes.length > 0 || this.edges.length > 0) { this.clearNetwork() }

    this.diaSvc.getDiagramData(userId, 0).pipe(untilComponentDestroyed(this)).subscribe(
      data => {
        console.log('DDX', data)
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
        if (!this.expanded.has(node.id)) {
          console.log('EXPAND', node)
          const izvodId = 0
          this.diaSvc.getExpandData(this.activeUser.id, izvodId, node.label, node.id).pipe(untilComponentDestroyed(this)).subscribe(
            data => {
              console.log('ENX', data)
              let payload = this.transformNodesEdges(data)

              this.nodes.add(payload.nodes)
              this.edges.add(payload.edges)
            }
          )

        } else {
          let nx
          try {
            nx = this.diaSvc.findParentUser(node, this.activeUser.id)
          } catch(e) {}
          if (nx) {
            this.diaSvc.addNodes(nx)
          }
        }
      } else if (node.type === 'user') {
        console.log('USRx', node, node.id, this.activeUser.id)
      }
    }
  }

  onClosed() {
    this.nodeActive = null
    this.edgeActive = null
    this.isSelectedActiveUser = false
    this.network.unselectAll()
    console.log('Closed infobox')
  }

  expandView() {
    this.viewLevel++
    console.log('EXPAND', this.viewLevel)
    console.log('TXX', this.nodes, this.edges)
  }
  contractView() {
    this.viewLevel--
    if (this.viewLevel < 0) { this.viewLevel = 0}
    console.log('CONTRACT', this.viewLevel)
    console.log('TXX', this.nodes, this.edges)
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
