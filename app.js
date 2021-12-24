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

const PERMISSIONS = [
  // first quadrant - me and my feelings
  'Joy',
  'Anger',
  'Fear',
  'Sadness',

  // second quadrant - me and the world
  'Succeed',
  'Think',
  'Know',
  'Grow up',

  // 3rd quadrant - me and others
  'Be a Child',
  'Be Close',
  'Belong',
  'Trust',

  // 4th quadrant - me and myself
  'Pleasure',
  'Self',
  'Health',
  'Exist',
]

const NUM_LEVELS = 10

Array.from({length: NUM_LEVELS}, (_, i) => {
  const level = 10 - i
  const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(30 * level)
      .startAngle(([startAngle, endAngle]) => startAngle)
      .endAngle(([startAngle, endAngle]) => endAngle)

  const n = PERMISSIONS.length
  Array.from({length: n}, (_, i) => {
    const angle = [i / n * 2 * Math.PI, (i + 1) / n * 2 * Math.PI]
    appendTo(wheel, 'path', {
      stroke: '#cccccc',
      'stroke-width': '2px',
      // fill: d3.interpolateRainbow(i / n),
      class: `permission permission_${i} level_${level}`,
      data: JSON.stringify({
        "permission": i,
        "level": level,
      }),
      fill: 'transparent',
      d: arc(angle),
      cursor: 'pointer',
    })
  })
})

const arcWords = d3.arc()
    .innerRadius(340)
    .outerRadius(340)
    .startAngle(([startAngle, endAngle]) => startAngle)
    .endAngle(([startAngle, endAngle]) => endAngle)

PERMISSIONS.forEach((permissionText, i) => {
  const n = PERMISSIONS.length
  const angle = [i / n * 2 * Math.PI, (i + 1) / n * 2 * Math.PI]
  const [xPos, yPos] = arcWords.centroid(angle)
  appendTo(wheel, 'text', {
    fill: '#223344',
    transform: `translate(${xPos - 30}, ${yPos})`,
  }, permissionText)
})

wheel.querySelectorAll('.permission').forEach( sectorElem =>
  sectorElem.addEventListener('click', () => {
    const data = JSON.parse(sectorElem.getAttribute('data'))
    wheel.querySelectorAll(`.permission_${data.permission}`).forEach(
      el => el.setAttribute('fill', 'transparent')
    )
    sectorElem.setAttribute('fill', '#4444aa')
  })
)
