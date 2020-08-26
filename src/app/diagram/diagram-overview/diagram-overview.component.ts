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
    if (this.nodeActive.type === 'user') {
      this.isSelectedActiveUser = this.nodeActive.id === this.activeUser.id
      this.nodeActive.user = this.nodeActive
      this.nodeActive.accounts = this.nodeActive.izvodi
    } else if (this.nodeActive.type === 'account') {
      //this.nodeActive.account = this.diaSvc.getAccounts(this.nodeActive.id)
      //this.nodeActive.account.user = this.diaSvc.getPerson(this.nodeActive.account.userId)
      //this.isSelectedActiveUser = this.activeUser.id === this.nodeActive.account.userId
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
    if (this.nodes.length > 0 || this.edges.length > 0) { this.clearNetwork() }
    let person = this.usersList.find(usr => { return usr.osobaID === userId })
    person.id = person.osobaID
    person.type = 'user'

    //const accounts = this.diaSvc.getUserAccounts(userId)
    const accounts = person.izvodi.map(itm => {
      itm.label = itm.brojRacuna + '\r\n' + itm.swift
      itm.type = 'account'
      itm.shape = 'box'
      itm.id = person.id * 1000 + itm.izvodID
      return itm
    })
    const accountLinks = accounts.map(itm => {
      return {
        from: person.id,
        to: itm.id,
        type: 'accountOwner'
      }
    })
    const accountsNodes = {
      nodes: accounts,
      edges: accountLinks
    }

    console.log('DSX', person, accountsNodes)
    person.label = person.naziv + (person.idBroj? ('\r\n(ID: ' + person.idBroj + ')') : '')

    this.diaSvc.addNode(person)
    this.diaSvc.addNodes(accountsNodes)
    this.activeUser = person
    this.isSelectedActiveUser = false
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
          /*
          let nodes = this.diaSvc.findConnectedNodes(node, this.activeUser.id)
          this.diaSvc.addNodes(nodes)
          this.expanded.add(node.id)
          nodes.nodes.forEach(itm => {
            this.expanded.add(itm.id)
          })
          */
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
