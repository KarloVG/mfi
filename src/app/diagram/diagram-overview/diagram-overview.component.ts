import { Component, OnInit, OnDestroy } from '@angular/core'
import { Network, DataSet, Node, Edge, IdType } from 'vis'

@Component({
  selector: 'app-diagram-overview',
  templateUrl: './diagram-overview.component.html',
  styleUrls: ['./diagram-overview.component.scss']
})
export class DiagramOverviewComponent implements OnInit, OnDestroy {
    nodes: Node = new DataSet([
      {id: 1, label: 'TCC'},
      {id: 2, label: 'Armaghast'},
      {id: 3, label: 'Maui-Covenant'},
      {id: 4, label: 'Nordholm'},
      {id: 5, label: 'Bressia'},
      {id: 6, label: 'Pacem'},
      {id: 7, label: 'Deneb Drei'},
      {id: 8, label: 'SDS'},
      {id: 9, label: 'Madhya'},
      {id: 10, label: 'Hyperion'},
    ]);
    edges: Edge = new DataSet([
      {from: 1, to: 8},
      {from: 1, to: 3},
      {from: 1, to: 4},
      {from: 1, to: 5},
      {from: 1, to: 6},
      {from: 1, to: 7},
      {from: 2, to: 10},
      {from: 3, to: 9},
      {from: 8, to: 2},
    ]);
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
      this.network.on('selectNode', ctx => {
        let idx = ctx.nodes[0]
        let linksTo = this.edges.get({
          filter: (itm) => { return itm.to === idx }
        })
        let linksFrom = this.edges.get({
          filter: (itm) => { return itm.from === idx }
        })
        this.nodeActive = this.nodes.get(idx)
        this.nodeActive.connections = linksTo.length + linksFrom.length
        console.log('Selected Node', idx, this.nodeActive)
        console.log('Connects to', linksTo.length, linksTo)
        console.log('Connects from', linksFrom.length, linksFrom)
      })
      this.network.on('deselectNode', ctx => {
        this.nodeActive = null
        console.log('Deselected Node')
      })
    }
    public ngOnDestroy(): void {}

    addNode() {
      const rnd = this.rndmm(20, 100)
      let newNode = {
        id: rnd,
        label: 'Node ' + rnd
      }
      this.nodes.update(newNode)

      let newEdge = {
        from: this.rndmm(1, 10),
        to: rnd
      }
      this.edges.update(newEdge)
      console.log('New Node', newNode, newEdge)
    }

    removeNode() {
      console.log('Remove Node', this.nodeActive)
    }

    rndmm(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }
}
