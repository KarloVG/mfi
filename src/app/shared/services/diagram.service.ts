import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import {Network, DataSet, Node, Edge, IdType} from 'vis'
import {BaseService} from 'src/app/statement-base/services/base.service'
import {SubjectService} from 'src/app/shared/services/subject.service'

@Injectable({
  providedIn: 'root'
})

export class DiagramService {
  private readonly CONTROLLER_NAME = 'Dijagram';

  public allUsers = []
  public allAccs = []
  public allTrans = []
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
    private http: HttpClient,
    private urlHelper: UrlHelperService,
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

  //getChartData(idOsoba: number, idIzvod?: number,): Observable<IChartResponse> {
  getTransactionData(idOsoba: number, idIzvod?: number,): Observable<any> {
      //const request: IChartRequest = {
      const request: any = {
          osobaID: idOsoba,
          izvodID: idIzvod,
      }
      const url = this.urlHelper.getUrl(this.CONTROLLER_NAME, 'chart');
      //return this.http.post<IChartResponse>(url, request);
      return this.http.post<any>(url, request);
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

  getTotals(transactions, key = 'amount') {
    if (transactions.length < 1) { return null }
    if (transactions.length == 1) { return transactions[0][key] }
    if (transactions.length > 1) {
      return transactions.reduce((pval, cval) => { return (pval[key]? pval[key] : pval) + cval[key]})
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
