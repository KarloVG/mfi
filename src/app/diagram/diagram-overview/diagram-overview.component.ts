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
  edgeActive: any = null

  usersList: Users[]
  activeUser: Users
  expanded = new Set([])

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

    this.network.on('deselectNode', ctx => { this.deselectNode(ctx) })
    this.network.on('deselectEdge', ctx => { this.deselectEdge(ctx) })
    this.network.on('dragEnd', ctx => { this.selectNode(ctx) })
    this.network.on('click', ctx => { this.inspectNode(ctx) })
    this.network.on('doubleClick', ctx => { this.expandNode(ctx) })

    this.diaSvc.assignNetwork(this.network, this.data, this.nodes, this.edges)
  }
  public ngOnDestroy(): void {}

  selectNode(ctx) {
    let idx = ctx.nodes[0]
    this.edgeActive = null
    this.nodeActive = this.nodes.get(idx)
    if (this.nodeActive.type === 'user') {
      this.nodeActive.user = this.diaSvc.getPerson(this.nodeActive.id)
      this.nodeActive.accounts = this.nodeActive.user.accounts.map(itm => { return this.diaSvc.getAccounts(itm) })

    } else if (this.nodeActive.type === 'account') {
      this.nodeActive.account = this.diaSvc.getAccounts(this.nodeActive.id)
      delete this.nodeActive.account.transactions
    }
  }
  deselectNode(ctx) {
    this.nodeActive = null
    this.edgeActive = null
 }
  controlNodeDragEnd(ctx) {}

  selectEdge(ctx) {
    let idx = ctx.edges[0]
    this.nodeActive = null
    this.edgeActive = null
    if (idx) {
      let edge = this.edges.get(idx)
      this.edgeActive = this.diaSvc.getTransactions(edge)
    }
  }
  deselectEdge(ctx) {
    this.nodeActive = null
    this.edgeActive = null
  }

  addUser(userId, typeId) {
    if (this.nodes.length > 0 || this.edges.length > 0) { this.clearNetwork() }
    const person = this.diaSvc.getPerson(userId)
    const accounts = this.diaSvc.getUserAccounts(userId)
    this.diaSvc.addNode(person)
    this.diaSvc.addNodes(accounts)
    this.activeUser = person
  }

  clearNetwork() {
    this.edges.remove(this.edges.get())
    this.nodes.remove(this.nodes.get())
  }

  inspectNode(ctx) {
    //console.log('INSPEX', ctx)
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
          let nodes = this.diaSvc.findConnectedNodes(node)
          this.diaSvc.addNodes(nodes)
          this.expanded.add(node.id)
          nodes.nodes.forEach(itm => {
            this.expanded.add(itm.id)
          })
        } else {
          let nodes = this.diaSvc.findParentUser(node)
          this.diaSvc.addNodes(nodes)
        }
      } else if (node.type === 'user') {
        console.log('USRx', node, ctx)
      }
    }
  }

  onClosed() {
    this.nodeActive = null
    this.edgeActive = null
    this.network.unselectAll()
    console.log('Closed infobox')
  }

  rndmm(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}
