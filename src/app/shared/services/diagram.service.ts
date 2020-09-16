import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlHelperService } from 'src/app/shared/services/url-helper.service';
import {Network, DataSet, Node, Edge, IdType} from 'vis'
import {BaseService} from 'src/app/statement-base/services/base.service'
import {SubjectService} from 'src/app/shared/services/subject.service'
import { IDiagramAccountDetailResponse } from 'src/app/diagram/models/DiagramAccountDetailResponse';
import { LocalStoreFilterService } from './local-store-filter.service';

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
    private filterService: LocalStoreFilterService
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

  getDiagramAccountDetail(ListaIzvoda: number[], BrojRacuna: string): Observable<IDiagramAccountDetailResponse> {
    const filterToken = this.filterService.hasToken();
    let request = {
      listaIzvoda: ListaIzvoda,
      brojRacuna: BrojRacuna,
      filterValues: null
    };
    if(filterToken) {
      request.filterValues = {
        A_NA: filterToken.Naziv,
        B_NA: filterToken.NazivB,
        T_DIR: filterToken.Smjer,
        A_RN: filterToken.BrojRacuna,
        B_RN: filterToken.BrojRacunaB,
        A_FIN: filterToken.Banka,
        B_FIN: filterToken.BankaB,
        T_DV_od: filterToken.DatumTrasakcijeOd,
        T_DV_do: filterToken.DatumTrasakcijeDo,
        A_FID: filterToken.Drzava,
        B_FID: filterToken.DrzavaB,
        T_VR: filterToken.VrstaTransakcije,
        T_KONV_IZ_od: filterToken.IznosOd,
        T_KONV_IZ_do: filterToken.IznosDo
      };
    }
    const url = this.urlHelper.getUrl(this.CONTROLLER_NAME, 'accountDetail')
    return this.http.post<IDiagramAccountDetailResponse>(url, request)
  }

  getDiagramAccountDetailList(ListaIzvoda: number[], BrojRacuna: string): Observable<IDiagramAccountDetailResponse> {
    const request = {
      listaIzvoda: ListaIzvoda,
      brojRacuna: BrojRacuna
    };
    const url = this.urlHelper.getUrl(this.CONTROLLER_NAME, 'accountDetailList')
    return this.http.post<IDiagramAccountDetailResponse>(url, request)
  }

  getDiagramPersonAccountDetail(osobaId: string, BrojRacuna: string): Observable<IDiagramAccountDetailResponse> {
    const filterToken = this.filterService.hasToken();
    let request = {
      osobaId: osobaId,
      brojRacuna: BrojRacuna,
      filterValues: null
    };
    if(filterToken) {
      request.filterValues = {
        A_NA: filterToken.Naziv,
        B_NA: filterToken.NazivB,
        T_DIR: filterToken.Smjer,
        A_RN: filterToken.BrojRacuna,
        B_RN: filterToken.BrojRacunaB,
        A_FIN: filterToken.Banka,
        B_FIN: filterToken.BankaB,
        T_DV_od: filterToken.DatumTrasakcijeOd,
        T_DV_do: filterToken.DatumTrasakcijeDo,
        A_FID: filterToken.Drzava,
        B_FID: filterToken.DrzavaB,
        T_VR: filterToken.VrstaTransakcije,
        T_KONV_IZ_od: filterToken.IznosOd,
        T_KONV_IZ_do: filterToken.IznosDo
      };
    }
    const url = this.urlHelper.getUrl(this.CONTROLLER_NAME, 'personDetail')
    return this.http.post<IDiagramAccountDetailResponse>(url, request)
  }

  assignNetwork(network, data, nodes, edges) {
    this.nodes = nodes
    this.edges = edges
    this.data = data
    this.network = network
    console.log('GLBX', this.network, this.nodes, this.edges)
  }

  getExpandData(idOsoba: number, idIzvod: number, broj_Racuna: string, nodeID: string): Observable<any> {
    const filterToken = this.filterService.hasToken();
    let request: any = {
      izvod_ID: idIzvod,
      osoba_ID: idOsoba,
      broj_Racuna: broj_Racuna,
      id: nodeID,
      filterValues: null
    }

    if(filterToken) {
      request.filterValues = {
        A_NA: filterToken.Naziv,
        B_NA: filterToken.NazivB,
        T_DIR: filterToken.Smjer,
        A_RN: filterToken.BrojRacuna,
        B_RN: filterToken.BrojRacunaB,
        A_FIN: filterToken.Banka,
        B_FIN: filterToken.BankaB,
        T_DV_od: filterToken.DatumTrasakcijeOd,
        T_DV_do: filterToken.DatumTrasakcijeDo,
        A_FID: filterToken.Drzava,
        B_FID: filterToken.DrzavaB,
        T_VR: filterToken.VrstaTransakcije,
        T_KONV_IZ_od: filterToken.IznosOd,
        T_KONV_IZ_do: filterToken.IznosDo
      };
      console.log('FilterValues', request.filterValues)
    }
    const url = this.urlHelper.getUrl(this.CONTROLLER_NAME, 'nestedData')
    return this.http.post<any>(url, request)
  }

  getExpandUserData(person_Identificator: string, broj_Racuna: string, nodeID: string): Observable<any> {
    const filterToken = this.filterService.hasToken();
    let request: any = {
      person_Identificator: person_Identificator,
      broj_Racuna: broj_Racuna,
      id: nodeID,
      filterValues: null
    }

    if(filterToken) {
      request.filterValues = {
        A_NA: filterToken.Naziv,
        B_NA: filterToken.NazivB,
        T_DIR: filterToken.Smjer,
        A_RN: filterToken.BrojRacuna,
        B_RN: filterToken.BrojRacunaB,
        A_FIN: filterToken.Banka,
        B_FIN: filterToken.BankaB,
        T_DV_od: filterToken.DatumTrasakcijeOd,
        T_DV_do: filterToken.DatumTrasakcijeDo,
        A_FID: filterToken.Drzava,
        B_FID: filterToken.DrzavaB,
        T_VR: filterToken.VrstaTransakcije,
        T_KONV_IZ_od: filterToken.IznosOd,
        T_KONV_IZ_do: filterToken.IznosDo
      };
      console.log('FilterValues', request.filterValues)
    }
    const url = this.urlHelper.getUrl(this.CONTROLLER_NAME, 'nestedPersonData')
    return this.http.post<any>(url, request)
  }

  getDiagramData(idOsoba, idIzvod): Observable<any> {
    let request = {
      osobaID: idOsoba,
      izvodID: idIzvod,
      filterValues: null
    }
    const url = this.urlHelper.getUrl(this.CONTROLLER_NAME, 'initial')
    return this.http.post<any>(url, request)
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

  private intersect(a, b) {
    var setB = new Set(b)
    return [...new Set(a)].filter(x => setB.has(x))
  }
}
