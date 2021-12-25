const wheel = document.getElementById("wheel")

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

Array.from({ length: NUM_LEVELS }, (_, i) => {
  const level = 10 - i
  const arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(30 * level)
    .startAngle(([startAngle, endAngle]) => startAngle)
    .endAngle(([startAngle, endAngle]) => endAngle)

  const n = PERMISSIONS.length
  Array.from({ length: n }, (_, i) => {
    const angle = [(i / n) * 2 * Math.PI, ((i + 1) / n) * 2 * Math.PI]
    d3.select(wheel)
      .append("path")
      .attr("stroke", "#bbbbbb")
      .attr("stroke-width", "2px")
      .attr("cursor", "pointer")
      .attr("fill", "transparent")
      .attr("d", arc(angle))
      .classed(`permission permission_${i} level_${level}`, true)
      .attr(
        "data",
        JSON.stringify({
          permission: i,
          level: level,
        }),
      )
  })
})

const arcWords = d3
  .arc()
  .innerRadius(340)
  .outerRadius(340)
  .startAngle(([startAngle, endAngle]) => startAngle)
  .endAngle(([startAngle, endAngle]) => endAngle)

PERMISSIONS.forEach((permissionText, i) => {
  const n = PERMISSIONS.length
  const angle = [(i / n) * 2 * Math.PI, ((i + 1) / n) * 2 * Math.PI]
  const [xPos, yPos] = arcWords.centroid(angle)
  d3.select(wheel)
    .append("text")
    .attr("fill", "#223344")
    .attr("font-size", "1.5em")
    .attr("transform", `translate(${xPos - 30}, ${yPos})`)
    .text(permissionText)
})

wheel.querySelectorAll(".permission").forEach((sectorElem) => {
  const resetPermissionSector = () => {
    const data = JSON.parse(sectorElem.getAttribute("data"))
    wheel
      .querySelectorAll(`.permission_${data.permission}`)
      .forEach((el) => el.setAttribute("fill", "transparent"))
    const color = "#4444aa"
    // const color = d3.interpolateRainbow(data.permission / PERMISSIONS.length - 0.5)
    sectorElem.setAttribute("fill", color)
  }
  sectorElem.addEventListener("click", resetPermissionSector)
})
