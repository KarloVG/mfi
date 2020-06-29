import { Component, OnInit, OnDestroy } from '@angular/core'
import { Network, DataSet, Node, Edge, IdType } from 'vis'

import { registerLocaleData } from '@angular/common';
import localeHr from '@angular/common/locales/hr';
registerLocaleData(localeHr, 'hr');

import { DiagramService } from 'src/app/shared/services/diagram.service'

interface Users {
  id: number
  name: string
  oib: string
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
  edgesActive: any = null

  usersList: Users[]

  public constructor(
    private diaSvc: DiagramService
  ) {
    this.usersList = this.diaSvc.getAllUsers()
  }

  public ngOnInit(): void {
    const container = document.getElementById('network')
    this.data = {
      nodes: this.nodes,
      edges: this.edges
    }
    this.network = new Network(container, this.data, this.options)

    this.network.on('selectNode', ctx => { this.selectNode(ctx) })
    this.network.on('deselectNode', ctx => { this.deselectNode(ctx) })
    this.network.on('dragEnd', ctx => { this.selectNode(ctx) })
    this.network.on('doubleClick', ctx => { this.expandNode(ctx) })

    this.diaSvc.assignNetwork(this.network, this.data, this.nodes, this.edges)
  }
  public ngOnDestroy(): void {}

  selectNode(ctx) {
    let idx = ctx.nodes[0]
    this.nodeActive = this.nodes.get(idx)
    if (this.nodeActive.type === 'user') {
      this.nodeActive.user = this.diaSvc.getPerson(this.nodeActive.id)
      this.nodeActive.accounts = this.nodeActive.user.accounts.map(itm => { return this.diaSvc.getAccounts(itm) })

    } else if (this.nodeActive.type === 'account') {
      this.nodeActive.account = this.diaSvc.getAccounts(this.nodeActive.id)
      delete this.nodeActive.account.transactions
    }
    console.log('Selected Node', idx, this.nodeActive)
  }
  deselectNode(ctx) {
    this.nodeActive = null
    console.log('Deselected Node')
  }
  controlNodeDragEnd(ctx) {
    console.log('dragStart', ctx)
  }

  addUser(userId, typeId) {
    const person = this.diaSvc.getPerson(userId)
    const accounts = this.diaSvc.getUserAccounts(userId)
    this.diaSvc.addNode(person)
    this.diaSvc.addNodes(accounts)
  }

  removeNode() {
    console.log('Remove Node', this.nodeActive)
  }

  expandNode(ctx) {
    let idx = ctx.nodes[0]
    const node = this.nodes.get(idx)
    console.log('CTX', node)
  }

  onClosed() {
    this.nodeActive = null
    this.network.unselectAll()
    console.log('Closed infobox')
  }

  rndmm(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}
