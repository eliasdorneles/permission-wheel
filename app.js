// helper functions stolen from: https://stackoverflow.com/a/9727850/149872
function appendTo(node,name,attrs,text){
  var p,ns=appendTo.ns,svg=node,doc=node.ownerDocument;
  if (!ns){ // cache namespaces by prefix once
    while (svg&&svg.tagName!='svg') svg=svg.parentNode;
    ns=appendTo.ns={svg:svg.namespaceURI};
    for (var a=svg.attributes,i=a.length;i--;){
      if (a[i].namespaceURI) ns[a[i].localName]=a[i].nodeValue;
    }
  }
  var el = doc.createElementNS(ns.svg,name);
  for (var attr in attrs){
    if (!attrs.hasOwnProperty(attr)) continue;
    if (!(p=attr.split(':'))[1]) el.setAttribute(attr,attrs[attr]);
    else el.setAttributeNS(ns[p[0]]||null,p[1],attrs[attr]);
  }
  if (text) el.appendChild(doc.createTextNode(text));
  return node.appendChild(el);
}

function clear(node){
  while (node.lastChild) node.removeChild(node.lastChild);
}

const wheel = document.getElementById('wheel')

const radius = 310
const n = 16

Array.from({length: 10}, (_, x) => {
  const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(31 * x)
      .startAngle(([startAngle, endAngle]) => startAngle)
      .endAngle(([startAngle, endAngle]) => endAngle)

  Array.from({length: n}, (_, i) => {
    appendTo(wheel, 'path', {
      stroke: '#778899',
      'stroke-width': '2px',
      // fill: d3.interpolateRainbow(i / n),
      fill: 'transparent',
      d: arc([i / n * 2 * Math.PI, (i + 1) / n * 2 * Math.PI]),
      cursor: 'pointer',
    })
  })
})
