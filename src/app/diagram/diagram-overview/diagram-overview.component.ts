import { Component, OnInit, OnDestroy } from '@angular/core';
import { Network, DataSet, Node, Edge, IdType } from 'vis';

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
      {from: 8, to: 2},
      {from: 3, to: 9},
      {from: 2, to: 10},
    ]);
    network: Network;
    options = {};
    data;

    public constructor() {}
    public ngOnInit(): void {
      const container = document.getElementById('network');
      this.data = {
        nodes: this.nodes,
        edges: this.edges
      };
      this.network = new Network(container, this.data, this.options);
    }
    public ngOnDestroy(): void {}

    addNode() {
      console.log('N', this.nodes)
      console.log('E', this.edges)
      console.log('X', this.network)
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
      console.log('NEW', newNode, newEdge)
    }

    rndmm(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min)
    }
}
