import {Injectable} from '@angular/core';
import {Network, DataSet, Node, Edge, IdType} from 'vis'
import {BaseService} from 'src/app/statement-base/services/base.service'
import {SubjectService} from 'src/app/shared/services/subject.service'

@Injectable({
  providedIn: 'root'
})

export class DiagramService {
  public allUsers = []
  public allAccs = [
    {id: 2001, userId: 7, accNo: 'HR100123', swift: 'ZABAHR2X', bank: 'ZABA', country: 'HR'}, // Marko Marković
    {id: 2002, userId: 7, accNo: 'HR100987', swift: 'ZABAHR2X', bank: 'ZABA', country: 'HR'}, // Marko Marković
    {id: 2003, userId: 7, accNo: 'HR200456', swift: 'PBZGHR2X', bank: 'PBZ',  country: 'HR'}, // Marko Marković
    {id: 2004, userId: 7, accNo: 'HR300333', swift: 'HPBZHR2X', bank: 'HPB',  country: 'HR'}, // Marko Marković
    {id: 2005, userId: 8, accNo: '123456',   swift: 'BOFAUS3N', bank: 'BOFA', country: 'US'}, // Petar Petrović
    {id: 2006, userId: 8, accNo: 'HR100246', swift: 'ZABAHR2X', bank: 'ZABA', country: 'HR'}, // Petar Petrović
    {id: 2007, userId: 103, accNo: 'HR200678', swift: 'ZABAHR2X', bank: 'ZABA', country: 'HR'}, // Dobra tvrtka d.o.o.
  ]
  public allTrans = [
    {id: 30001, transactionId: 30001, accId: 2001, transaction: 'Uplata',  amount: 3500,  dest: null, direction: 1},
    {id: 30002, transactionId: 30002, accId: 2001, transaction: 'Isplata', amount: 5000,  dest: null, direction: -1},
    {id: 30003, transactionId: 30003, accId: 2001, transaction: 'Isplata', amount: 3250,  dest: null, direction: -1},
    {id: 30004, transactionId: 30004, accId: 2002, transaction: 'Isplata', amount: 25000, dest: null, direction: -1},

    {id: 30005, transactionId: 30005, accId: 2003, transaction: 'Uplata',  amount: 10000, dest: 2006, direction: 1}, // HR200456 PBZ <- HR100246 ZABA, Marko <- Petar
    {id: 30006, transactionId: 30006, accId: 2003, transaction: 'Uplata',  amount: 7000,  dest: 2007, direction: 1}, // HR200456 PBZ <- HR200678 ZABA, Marko <- Tvrtka
    {id: 30007, transactionId: 30007, accId: 2003, transaction: 'Uplata',  amount: 1500,  dest: 2007, direction: 1}, // HR200456 PBZ <- HR200678 ZABA, Marko <- Tvrtka
    {id: 30008, transactionId: 30008, accId: 2003, transaction: 'Uplata',  amount: 1250,  dest: 2007, direction: 1}, // HR200456 PBZ <- HR200678 ZABA, Marko <- Tvrtka
    {id: 30009, transactionId: 30009, accId: 2003, transaction: 'Isplata', amount: 74100, dest: 2005, direction: -1}, // HR200456 PBZ -> BOFA123456, Marko -> Petar
    {id: 30009, transactionId: 30009, accId: 2003, transaction: 'Uplata',  amount: 100,   dest: 2005, direction: 1}, // HR200456 PBZ <- BOFA123456, Marko <- Petar

    {id: 30010, transactionId: 30010, accId: 2005, transaction: 'Uplata',  amount: 74100, dest: 2003, direction: 1}, // BOFA123456 <- HR200456 PBZ, Petar <- Marko
    {id: 30010, transactionId: 30010, accId: 2005, transaction: 'Isplata', amount: 100,   dest: 2003, direction: -1}, // BOFA123456 -> HR200456 PBZ, Petar -> Marko

    {id: 30011, transactionId: 30011, accId: 2006, transaction: 'Isplata', amount: 10000, dest: 2003, direction: -1}, // HR100246 -> HR200456, Petar -> Marko

    {id: 30012, transactionId: 30012, accId: 2007, transaction: 'Isplata', amount: 7000, dest: 2003, direction: -1}, // HR200678 -> HR200456, Tvrtka -> Marko
    {id: 30013, transactionId: 30013, accId: 2007, transaction: 'Isplata', amount: 1500, dest: 2003, direction: -1}, // HR200678 -> HR200456, Tvrtka -> Marko
    {id: 30014, transactionId: 30014, accId: 2007, transaction: 'Isplata', amount: 1250, dest: 2003, direction: -1}, // HR200678 -> HR200456, Tvrtka -> Marko
  ]
  network: Network
  nodes: Node = new DataSet([])
  edges: Edge = new DataSet([])
  options = {
    account: {
      shape: 'box'
    },
    connectedAccount: {
      shape: 'box',
      color: {
        border: '#372',
        background: '#6c5',
        highlight: {
          border: '#372',
          background: '#7e5'
        }
      }
    },
    connectedUser: {
      color: {
        border: '#372',
        background: '#6c5',
        highlight: {
          border: '#372',
          background: '#7e5'
        }
      }
    },
    accountOwner: {
      dashes: true,
      color: {
        color: '#aaa',
        highlight: '#777',
        hover: '#ccc'
      }
    },
    transactionInbound: {
      arrows: {
        from: { enabled: true }
      },
      color: {
        color: '#aaa',
        highlight: '#777',
        hover: '#ccc'
      }
    },
    transactionOutbound: {
      arrows: {
        to: { enabled: true }
      },
      color: {
        color: '#aaa',
        highlight: '#777',
        hover: '#ccc'
      }
    },
  }
  data: any
  subjectId

  constructor(
    private subjectService: SubjectService,
    private baseService: BaseService,
  ) {
    this.subjectId = +this.subjectService.hasToken()
    this.baseService.getBaseItems().subscribe(
      data => {
        this.allUsers = data
      },
      err => {
        console.warn('ERR', err)
      }
    )
  }

  assignNetwork(network, data, nodes, edges) {
    this.nodes = nodes
    this.edges = edges
    this.data = data
    this.network = network
    console.log('GLBX', this.network, this.nodes, this.edges)
  }

  getAllUsers() {
    return this.allUsers
  }

  getPerson(id) {
    const person = this.allUsers.find(itm => { return itm.id === id })
    const accountIdList = this.allAccs.filter(itm => { return itm.userId === id }).map(itm => { return itm.id })
    console.log('GPX', id, person, accountIdList)
    return {
      id: person.osobaID,
      label: person.naziv + '\r\nOIB: ' + person.idBroj,
      type: 'user',
      mass: 1,
      name: person.naziv,
      oib: person.idBroj,
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
        ...{
          id: itm.id,
          label: itm.accNo + '\r\n' + itm.swift,
          type: 'account',
          mass: 1,
          transactions: trans
        },
        ...this.options.account
      })
      edges.push({
        ...{
          from: id,
          to: itm.id,
          type: 'accountOwner'
        },
        ...this.options.accountOwner
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

  findConnectedNodes(node, activeUserId?) {
    const acc = this.getAccounts(node.id)
    let trIn = acc.transactions.transactions.inbound
    let trOut = acc.transactions.transactions.outbound
    let accsInList = [...new Set(trIn.flatMap(itm => { return itm.dest}))]
    let accsOutList = [...new Set(trOut.flatMap(itm => { return itm.dest}))]

    let nodes = []
    let edges = []
    if (accsInList[0] === null) { accsInList = [] }
    if (accsInList.length > 1) {
      accsInList.forEach(itm => {
        let itmAcc = this.getAccounts(itm)
        const trans = this.getAccountTransactions(itm)
        let type = 'account'
        if (activeUserId) {
          try {
            type = itmAcc.userId === activeUserId? 'account' : 'connectedAccount'
          } catch(e) {
            type = 'account'
          }
        }
        nodes.push({
          ...{
            id: itmAcc.id, // HERE
            label: itmAcc.accNo + '\r\n' + itmAcc.swift,
            type: 'account',
            mass: 1,
            account: itmAcc,
            transactions: trans,
          },
          ...this.options[type]
        })
        edges.push({
          ...{
            from: node.id,
            to: itmAcc.id,
            title: accsInList.length,
            label: accsInList.length,
            type: 'transactionInbound'
          },
          ...this.options.transactionInbound
        })
      })
    }
    if (accsOutList[0] === null) { accsOutList = [] }
    if (accsOutList.length > 1) {
      accsOutList.forEach(itm => {
        let itmAcc = this.getAccounts(itm)
        const trans = this.getAccountTransactions(itm)
        console.log('HLOx', itm, itmAcc, trans)
        let type = 'account'
        if (activeUserId) {
          try {
            type = itmAcc.userId === activeUserId? 'account' : 'connectedAccount'
          } catch(e) {
            type = 'account'
          }
        }
        nodes.push({
          ...{
            id: itmAcc.id, // HERE
            label: itmAcc.accNo + '\r\n' + itmAcc.swift,
            type: 'account',
            mass: 1,
            account: itmAcc,
            transactions: trans,
          },
          ...this.options[type]
        })
        edges.push({
          ...{
            from: node.id,
            to: itmAcc.id,
            title: accsOutList.length,
            label: accsOutList.length,
            type: 'transactionOutbound'
          },
          ...this.options.transactionOutbound
        })
      })
    }

    return {
      nodes: nodes,
      edges: edges
    }
  }

  findParentUser(node, activeUserId?) {
    let user = this.getPerson(node.account.userId)
    let accounts = this.intersect(this.nodes.getIds(), user.accounts)
    let nodes = []
    let edges = []
    if (activeUserId) {
      let type = user.id === activeUserId? 'accountOwner' : 'connectedUser'
      user = {...user, ...this.options[type]}
    }
    nodes.push(user)
    accounts.forEach(acc => {
      edges.push({
        ...{
          from: user.id,
          to: acc,
          type: 'accountOwner',
        },
        ...this.options.accountOwner
      })
    })

    return {
      nodes: nodes,
      edges: edges
    }
  }

  getTransactions(edge) {
    let accFrom = this.getAccounts(edge.from)
    let accTo = this.getAccounts(edge.to)
    return {
      connection: edge,
      accounts: {
        from: accFrom,
        to: accTo
      }
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
        this.nodes.update(itm)
      })
      nodeArray.edges.forEach(itm => {
        this.edges.update(itm)
      })
    } else {
      console.warn('Error in input format.', nodeArray)
    }
  }
  addEdge(edge) {
    this.edges.update(edge)
  }

  private intersect(a, b) {
    var setB = new Set(b)
    return [...new Set(a)].filter(x => setB.has(x))
  }
}
