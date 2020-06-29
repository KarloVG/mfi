import { Injectable } from '@angular/core';
import { Network, DataSet, Node, Edge, IdType } from 'vis'

@Injectable({
  providedIn: 'root'
})

export class DiagramService {
  public allUsers = [
    {id: 101, name: 'Marko Marković', oib: '12345', totalIn: 31950, totalOut: 115450},
    {id: 102, name: 'Petar Petrović', oib: '67890', totalIn: 0, totalOut: 0},
    {id: 103, name: 'Dobra tvrtka d.o.o.', oib: '45678', totalIn: 0, totalOut: 0},
  ]
  public allAccs = [
    {id: 2001, userId: 101, accNo: 'HR100123', swift: 'ZABAHR2X', bank: 'ZABA', country: 'HR'},
    {id: 2002, userId: 101, accNo: 'HR100987', swift: 'ZABAHR2X', bank: 'ZABA', country: 'HR'},
    {id: 2003, userId: 101, accNo: 'HR200456', swift: 'PBZGHR2X', bank: 'PBZ', country: 'HR'},
    {id: 2004, userId: 101, accNo: 'HR300333', swift: 'HPBZHR2X', bank: 'HPB', country: 'HR'},
    {id: 2005, userId: 103, accNo: '123456', swift: 'BOFAUS3N', bank: 'BOFA', country: 'US'},
  ]
  public allTrans = [
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
  network: Network
  nodes: Node = new DataSet([])
  edges: Edge = new DataSet([])
  options = {
    account: {
      shape: 'box'
    },
    accountOwner: {
      dashes: true,
      color: {
        color: '#aaa',
        highlight: '#777',
        hover: '#ccc'
      }
    }
  }
  data: any

  constructor() {}

  assignNetwork(network, data, nodes, edges) {
    this.nodes = nodes
    this.edges = edges
    this.data = data
    this.network = network
  }

  getAllUsers() {
    return this.allUsers
  }

  getPerson(id: any) {
    const person = this.allUsers.find(itm => { return itm.id === id })
    const accountIdList = this.allAccs.filter(itm => { return itm.userId === id }).map(itm => { return itm.id })
    return {
      id: person.id,
      label: person.name + '\r\nOIB: ' + person.oib,
      type: 'user',
      mass: 1,
      name: person.name,
      oib: person.oib,
      totalIn: person.totalIn,
      totalOut: person.totalOut,
      accounts: accountIdList
    }
  }

  getUserAccounts(id) {
    const accsList = this.allAccs.filter(itm => { return itm.userId === id })
    let nodes = []
    let edges = []
    accsList.forEach(itm => {
      const trans = this.getAccountTransactions(itm.id)
      nodes.push({
        id: itm.id,
        label: itm.accNo + '\r\n' + itm.swift,
        type: 'account',
        mass: 1,
        transactions: trans
      })
      edges.push({
        from: id,
        to: itm.id,
        type: 'accountOwner'
      })
    })

    return {
      nodes: nodes,
      edges: edges
    }
  }

  getAccounts(accId) {
    const accsList = this.allAccs.filter(itm => { return itm.id === accId })
    let list
    accsList.forEach(itm => {
      const trans = this.getAccountTransactions(itm.id)
      list = {
        id: itm.id,
        label: itm.accNo + '\r\n' + itm.swift,
        accNo: itm.accNo,
        bank: itm.bank,
        swift: itm.swift,
        country: itm.country,
        userId: itm.userId,
        type: 'account',
        transactions: trans
      }
    })
    return list
  }

  getAccountTransactions(accId) {
    const transactionsIn = this.allTrans.filter(titm => { return titm.accId === accId && titm.direction === 1 })
    const transactionsOut = this.allTrans.filter(titm => { return titm.accId === accId && titm.direction === -1 })

    return {
      transactions: {
        inbound: transactionsIn,
        outbound: transactionsOut
      },
      totals: {
        inbound: {
          count: transactionsIn.length,
          amount: this.getTotals(transactionsIn)
        },
        outbound: {
          count: transactionsOut.length,
          amount: this.getTotals(transactionsOut)
        }
      }
    }
  }

  getTotals(transactions) {
    if (transactions.length < 1) { return null }
    if (transactions.length == 1) { return transactions[0].amount }
    if (transactions.length > 1) {
      return transactions.reduce((pval, cval) => { return (pval.amount? pval.amount : pval) + cval.amount})
    }
  }

  addNode(node: any) {
    this.nodes.update(node)
  }
  addNodes(nodeArray: any) {
    if (nodeArray instanceof Array) {
      nodeArray.forEach(itm => {
        this.nodes.update(itm)
      })
    } else if ('nodes' in nodeArray && 'edges' in nodeArray) {
      nodeArray.nodes.forEach(itm => {
        this.nodes.update({...itm, ...this.options.account})
      })
      nodeArray.edges.forEach(itm => {
        this.edges.update({...itm, ...this.options.accountOwner})
      })
    } else {
      console.warn('Error in input format.', nodeArray)
    }
  }
}
