var bel = require('bel')
var csjs = require('csjs-inject')
//var cytoscape = require('cytoscape')

var jsons

function html () {
  var css = csjs`
  .cy {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 999;
  }
  `
  document.body.innerHTML = `<div class=${css.cy}></div>`
  var cyDiv = document.body.children[0]
  function createCy (cyNodes, cyEdges) {
    var cy = window.cy = cytoscape({
      container: cyDiv,
      boxSelectionEnabled: false,
      autounselectify: true,
      style: [
        {
          selector: 'node',
          style: {
            'content': 'data(label)',
            'text-opacity': 0.8,
            'text-valign': 'center',
            'text-halign': 'right',
            'background-color': 'green'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 4,
            'target-arrow-shape': 'triangle',
            'line-color': 'green',
            'target-arrow-color': 'red',
            'curve-style': 'bezier'
          }
        }
      ],

      elements: {
        nodes: cyNodes,
        edges: cyEdges
      },
    })
  }

  var arr = [
    "http://172.31.253.118:9966/json_s/1.json",
    "http://172.31.253.118:9966/json_s/2.json",
    "http://172.31.253.118:9966/json_s/3.json",
    "http://172.31.253.118:9966/json_s/4.json",
    "http://172.31.253.118:9966/json_s/5.json",
    "http://172.31.253.118:9966/json_s/6.json",
    "http://172.31.253.118:9966/json_s/7.json",
    "http://172.31.253.118:9966/json_s/8.json",
    "http://172.31.253.118:9966/json_s/9.json",
    "http://172.31.253.118:9966/json_s/10.json"
  ]

  var el = bel`
  <div>
    <div>${displayDependencies()}</div>
    ${cyDiv}
  </div>
  `

  function getNodesAndEdges (arr) {
    var cyNodes = []
    var cyEdges = []
    arr.forEach((workshop,id)=>{
      cyNodes.push({ data: { id: 'n'+id, label: workshop.title } })
      generateEdges(workshop, id, cyEdges)
    })
    createCy(cyNodes, cyEdges)
  }

  function generateEdges(workshop, id, edges) {
    console.log()
    workshop.needs.forEach((url,i) => {
      edges.push({ data: { source: 'n'+i, target: 'n'+id } })
    })
  }

  function displayDependencies () {
    getData((err,data) => {
      if (err) { console.log(err) }
      else {
        getNodesAndEdges(data)
      }
    })
  }

  function getData (next) {
    var promises = arr.map(fetchJson)
    Promise.all(promises).then(result => {
      next(null, result)
    })
  }

  async function fetchJson (url) {
    var response = await fetch(url)
    var result = await response.json()
    result.url = url
    return result
  }

  document.body.appendChild(el)
}

html()

/*
elements: {
  nodes: [
    { data: { id: 'n0', label: 'Less than 15,000' } },
    { data: { id: 'n1', label: 'More than 14,999' } },
    { data: { id: 'n2', label: 'More than 24,999' } },
    { data: { id: 'n3', label: 'More than 34,999' } },
    { data: { id: 'n4', label: 'Less than 500k' } },
    { data: { id: 'n5', label: 'Buy more tickets' } },
    { data: { id: 'n7', label: 'Condition to be met' } },
    { data: { id: 'n8', label: 'Won the lottery' } },
    { data: { id: 'n9', label: 'Over £1,000,000' } },
    { data: { id: 'n10', label: 'Ending it here' } },
    { data: { id: 'n11', label: 'Buy more tickets' } },
    { data: { id: 'n12', label: 'Bribe the judges' } }
  ],
  edges: [
    { data: { source: 'n0', target: 'n1' } },
    { data: { source: 'n1', target: 'n2' } },
    { data: { source: 'n1', target: 'n7' } },
    { data: { source: 'n2', target: 'n3' } },
    { data: { source: 'n3', target: 'n12' } },
    { data: { source: 'n2', target: 'n4' } },
    { data: { source: 'n4', target: 'n5' } },
    { data: { source: 'n4', target: 'n7' } },
    { data: { source: 'n1', target: 'n8' } },
    { data: { source: 'n0', target: 'n9' } },
    { data: { source: 'n9', target: 'n11' } },
    { data: { source: 'n11', target: 'n10' } }
  ]
},
*/
