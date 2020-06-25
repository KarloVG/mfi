import { Component, OnInit, OnDestroy } from '@angular/core'
import { Network, DataSet, Node, Edge, IdType } from 'vis'

import { registerLocaleData } from '@angular/common';
import localeHr from '@angular/common/locales/hr';
registerLocaleData(localeHr, 'hr');

@Component({
  selector: 'app-diagram-overview',
  templateUrl: './diagram-overview.component.html',
  styleUrls: ['./diagram-overview.component.scss']
})
export class DiagramOverviewComponent implements OnInit, OnDestroy {
  allUsers = [
    {id: 101, name: 'Marko Markovic', oib: '12345', totalIn: 31950, totalOut: 115450},
    {id: 102, name: 'Petar Petrovic', oib: '67890', totalIn: 0, totalOut: 0},
    {id: 103, name: 'Dobra tvrtka d.o.o.', oib: '45678', totalIn: 0, totalOut: 0},
  ]
  allAccs = [
    {id: 2001, userId: 101, accNo: 'HR100123', swift: 'ZABAHR2X', bank: 'ZABA', country: 'HR'},
    {id: 2002, userId: 101, accNo: 'HR100987', swift: 'ZABAHR2X', bank: 'ZABA', country: 'HR'},
    {id: 2003, userId: 101, accNo: 'HR200456', swift: 'PBZGHR2X', bank: 'PBZ', country: 'HR'},
    {id: 2004, userId: 101, accNo: 'HR300333', swift: 'HPBZHR2X', bank: 'HPB', country: 'HR'},
    {id: 2005, userId: 103, accNo: '123456', swift: 'BOFAUS3N', bank: 'BOFA', country: 'US'},
  ]
  allTrans = [
    {id: 30001, accId: 2001, transaction: 'Uplata', amount: 3500, direction: 1},
    {id: 30002, accId: 2001, transaction: 'Isplata', amount: 5000, direction: -1},
    {id: 30003, accId: 2001, transaction: 'Isplata', amount: 3250, direction: -1},
    {id: 30004, accId: 2002, transaction: 'Isplata', amount: 25000, direction: -1},
    {id: 30005, accId: 2003, transaction: 'Uplata', amount: 10000, direction: 1},
    {id: 30006, accId: 2003, transaction: 'Uplata', amount: 7000, direction: 1},
    {id: 30007, accId: 2003, transaction: 'Uplata', amount: 1500, direction: 1},
    {id: 30008, accId: 2003, transaction: 'Uplata', amount: 1250, direction: 1},
    {id: 30009, accId: 2003, transaction: 'Isplata', amount: 74100, direction: -1},
  ]

  nodes: Node = new DataSet([])
  edges: Edge = new DataSet([])
  network: Network
  options = {}
  data
  nodeActive: any = null
  edgesActive: any = null

  public constructor() {}
  public ngOnInit(): void {
    const container = document.getElementById('network')
    this.data = {
      nodes: this.nodes,
      edges: this.edges
    }
    this.network = new Network(container, this.data, this.options)

    console.log('AllAccs', this.allAccs)

    this.network.on('selectNode', ctx => { this.selectNode(ctx) })
    this.network.on('deselectNode', ctx => { this.deselectNode(ctx) })
    this.network.on('dragEnd', ctx => { this.selectNode(ctx) })
  }
  public ngOnDestroy(): void {}

  selectNode(ctx) {
    let idx = ctx.nodes[0]
    this.nodeActive = this.nodes.get(idx)
    if (this.nodeActive.type === 'user') {
      this.nodeActive.user = this.allUsers.find(itm => { return itm.id === this.nodeActive.id })
      this.nodeActive.accounts = []
      this.nodeActive.accounts.push(...this.allAccs.filter(itm => { return itm.userId === this.nodeActive.user.id }))
      let ai = 0
      this.nodeActive.accounts.forEach(aitm => {
        this.nodeActive.accounts[ai].totalIn = null
        this.nodeActive.accounts[ai].totalOut = null
        this.nodeActive.accounts[ai].totalInCount = null
        this.nodeActive.accounts[ai].totalOutCount = null
        this.nodeActive.accounts[ai].transactions = []
        this.nodeActive.accounts[ai].transactions.push(...this.allTrans.filter(titm => { return titm.accId === aitm.id }))
        if (this.nodeActive.accounts[ai].transactions.length > 1) {
          this.nodeActive.accounts[ai].totalIn = this.nodeActive.accounts[ai].transactions.filter(itm => { return itm.direction == 1}).reduce((pval, cval) => {  return (pval.amount? pval.amount : pval) + cval.amount})
          this.nodeActive.accounts[ai].totalOut = this.nodeActive.accounts[ai].transactions.filter(itm => { return itm.direction == -1}).reduce((pval, cval) => { return (pval.amount? pval.amount : pval) + cval.amount})
          if (typeof this.nodeActive.accounts[ai].totalIn === 'object' && 'amount' in this.nodeActive.accounts[ai].totalIn) { this.nodeActive.accounts[ai].totalIn = this.nodeActive.accounts[ai].totalIn.amount }
          if (typeof this.nodeActive.accounts[ai].totalOut === 'object' && 'amount' in this.nodeActive.accounts[ai].totalOut) { this.nodeActive.accounts[ai].totalOut = this.nodeActive.accounts[ai].totalOut.amount }
        } else if (this.nodeActive.accounts[ai].transactions.length == 1) {
          if (this.nodeActive.accounts[ai].transactions.filter(itm => { return itm.direction == 1}).length === 1) { this.nodeActive.accounts[ai].totalIn = this.nodeActive.accounts[ai].transactions.filter(itm => { return itm.direction == 1})[0].amount }
          if (this.nodeActive.accounts[ai].transactions.filter(itm => { return itm.direction == -1}).length === 1) { this.nodeActive.accounts[ai].totalOut = this.nodeActive.accounts[ai].transactions.filter(itm => { return itm.direction == -1})[0].amount }
        }
        this.nodeActive.accounts[ai].totalInCount = this.nodeActive.accounts[ai].transactions.filter(itm => { return itm.direction == 1}).length
        this.nodeActive.accounts[ai].totalOutCount = this.nodeActive.accounts[ai].transactions.filter(itm => { return itm.direction == -1}).length
        ai++
      })
    } else if (this.nodeActive.type === 'account') {
      let acc = this.allAccs.find(itm => { return itm.id === this.nodeActive.id })
      this.nodeActive.user = this.allUsers.find(itm => { return itm.id === acc.userId })
      this.nodeActive.account = acc

      this.nodeActive.account.totalIn = null
      this.nodeActive.account.totalOut = null
      this.nodeActive.account.totalInCount = null
      this.nodeActive.account.totalOutCount = null
      this.nodeActive.account.transactions = []
      this.nodeActive.account.transactions.push(...this.allTrans.filter(titm => { return titm.accId === acc.id }))

      if (this.nodeActive.account.transactions.length > 1) {
        this.nodeActive.account.totalIn = this.nodeActive.account.transactions.filter(itm => { return itm.direction == 1}).reduce((pval, cval) => {  return (pval.amount? pval.amount : pval) + cval.amount})
        this.nodeActive.account.totalOut = this.nodeActive.account.transactions.filter(itm => { return itm.direction == -1}).reduce((pval, cval) => { return (pval.amount? pval.amount : pval) + cval.amount})
        if (typeof this.nodeActive.account.totalIn === 'object' && 'amount' in this.nodeActive.account.totalIn) { this.nodeActive.account.totalIn = this.nodeActive.account.totalIn.amount }
        if (typeof this.nodeActive.account.totalOut === 'object' && 'amount' in this.nodeActive.account.totalOut) { this.nodeActive.account.totalOut = this.nodeActive.account.totalOut.amount }
      } else if (this.nodeActive.account.transactions.length == 1) {
        if (this.nodeActive.account.transactions.filter(itm => { return itm.direction == 1}).length === 1) { this.nodeActive.account.totalIn = this.nodeActive.account.transactions.filter(itm => { return itm.direction == 1})[0].amount }
        if (this.nodeActive.account.transactions.filter(itm => { return itm.direction == -1}).length === 1) { this.nodeActive.account.totalOut = this.nodeActive.account.transactions.filter(itm => { return itm.direction == -1})[0].amount }
      }
      this.nodeActive.account.totalInCount = this.nodeActive.account.transactions.filter(itm => { return itm.direction == 1}).length
      this.nodeActive.account.totalOutCount = this.nodeActive.account.transactions.filter(itm => { return itm.direction == -1}).length
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

  addUser() {
    const person = this.allUsers[0]
    this.nodes.update({
      id: person.id,
      label: person.name + '\r\nOIB: ' + person.oib,
      type: 'user'
    })

    const accsList = this.allAccs.filter(itm => { return itm.userId === person.id })
    accsList.forEach(itm => {
      this.nodes.update({
        id: itm.id,
        label: itm.accNo + '\r\n' + itm.swift,
        type: 'account'
      })
      this.edges.update({
        from: person.id,
        to: itm.id
      })
    })
  }

  removeNode() {
    console.log('Remove Node', this.nodeActive)
  }

  onClosed() {
    this.nodeActive = null
    this.network.releaseNode()
    console.log('Closed infobox')
  }

  rndmm(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}
