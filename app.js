const svgBox = document.getElementById("svgBox")

const radius = 310
const n = 16

const PERMISSIONS = [
  // first quadrant - me and my feelings
  "Joy",
  "Anger",
  "Fear",
  "Sadness",

  // second quadrant - me and the world
  "Succeed",
  "Think",
  "Know",
  "Grow up",

  // 3rd quadrant - me and others
  "Be a Child",
  "Be Close",
  "Belong",
  "Trust",

  // 4th quadrant - me and myself
  "Pleasure",
  "Self",
  "Health",
  "Exist",
]

const NUM_LEVELS = 10

const calcAngle = (i, n) => {
  const start = (i / n) * 2 * Math.PI
  const end = ((i + 1) / n) * 2 * Math.PI
  return [start, end]
}

// draw wheel
Array.from({ length: NUM_LEVELS }, (_, x) => {
  const level = 10 - x
  const arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(30 * level)
    .startAngle(([startAngle, endAngle]) => startAngle)
    .endAngle(([startAngle, endAngle]) => endAngle)

  PERMISSIONS.forEach((_, index) => {
    d3.select(svgBox)
      .append("path")
      .attr("stroke", "#bbbbbb")
      .attr("stroke-width", "2px")
      .attr("cursor", "pointer")
      .attr("fill", "transparent")
      .attr("d", arc(calcAngle(index, PERMISSIONS.length)))
      .classed(`permission permission_${index} level_${level}`, true)
      .attr(
        "data",
        JSON.stringify({
          permission: index,
          level: level,
        }),
      )
  })
})

// draw permission labels
const labelArc = d3
  .arc()
  .innerRadius(345)
  .outerRadius(345)
  .startAngle(([startAngle, endAngle]) => startAngle)
  .endAngle(([startAngle, endAngle]) => endAngle)

PERMISSIONS.forEach((permLabel, index) => {
  const angle = calcAngle(index, PERMISSIONS.length)
  const [xPos, yPos] = labelArc.centroid(angle)
  d3.select(svgBox)
    .append("text")
    .attr("fill", "#223344")
    .attr("font-size", "1.5em")
    .attr("transform", `translate(${xPos - 45}, ${yPos})`)
    .text(permLabel)
})

// draw quadrant arrows
const arrowRadius = radius + 10

d3.select(svgBox)
  .append("path")
  .attr("stroke", "#223344")
  .attr("stroke-width", "4px")
  .attr(
    "d",
    d3.line()([
      [-arrowRadius, 0],
      [arrowRadius, 0],
    ]),
  )
d3.select(svgBox)
  .append("path")
  .attr("fill", "#223344")
  .attr("transform", `translate(${arrowRadius} 0) rotate(90)`)
  .attr("d", d3.symbol(d3.symbolTriangle, 300)())
d3.select(svgBox)
  .append("path")
  .attr("fill", "#223344")
  .attr("transform", `translate(-${arrowRadius} 0) rotate(270)`)
  .attr("d", d3.symbol(d3.symbolTriangle, 300)())

d3.select(svgBox)
  .append("path")
  .attr("stroke", "#223344")
  .attr("stroke-width", "4px")
  .attr(
    "d",
    d3.line()([
      [0, -arrowRadius],
      [0, arrowRadius],
    ]),
  )
d3.select(svgBox)
  .append("path")
  .attr("fill", "#223344")
  .attr("transform", `translate(0, -${arrowRadius})`)
  .attr("d", d3.symbol(d3.symbolTriangle, 300)())
d3.select(svgBox)
  .append("path")
  .attr("fill", "#223344")
  .attr("transform", `rotate(180) translate(0, -${arrowRadius})`)
  .attr("d", d3.symbol(d3.symbolTriangle, 300)())

// setup events
svgBox.querySelectorAll(".permission").forEach((sectorElem) => {
  const resetPermissionSector = () => {
    const data = JSON.parse(sectorElem.getAttribute("data"))
    svgBox
      .querySelectorAll(`.permission_${data.permission}`)
      .forEach((el) => el.setAttribute("fill", "transparent"))
    const color = "#4444aa"
    // const color = d3.interpolateRainbow(data.permission / PERMISSIONS.length - 0.5)
    sectorElem.setAttribute("fill", color)
  }
  sectorElem.addEventListener("click", resetPermissionSector)
})
