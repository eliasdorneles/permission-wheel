const TRANSLATIONS = {
  en: {
    title: "The Permission Wheel",
    quadrants: [
      {
        name: "Me and my feelings",
        permissions: ["Joy", "Anger", "Fear", "Sadness"],
      },
      {
        name: "Me and the world",
        permissions: ["Succeed", "Think", "Know", "Grow up"],
      },
      {
        name: "Me and others",
        permissions: ["Be a Child", "Be Close", "Belong", "Trust"],
      },
      {
        name: "Me and myself",
        permissions: ["Pleasure", "Self", "Health", "Exist"],
      },
    ],
    copyLink: "Copy link",
    copied: "Copied!",
  },
  fr: {
    title: "La Roue des Permissions",
    quadrants: [
      {
        name: "Moi et mes sentiments",
        permissions: ["Joie", "Colère", "Peur", "Tristesse"],
      },
      {
        name: "Moi et le monde",
        permissions: ["Réussir", "Penser", "Savoir", "Grandir"],
      },
      {
        name: "Moi et les autres",
        permissions: ["Être enfant", "Être proche", "Appartenir", "Faire confiance"],
      },
      {
        name: "Moi et moi-même",
        permissions: ["Plaisir", "Être moi-même", "Santé", "Exister"],
      },
    ],
    copyLink: "Copier le lien",
    copied: "C'est copié !",
  },
  pt: {
    title: "A Roda das Permissões",
    quadrants: [
      {
        name: "Eu e meus sentimentos",
        permissions: ["Alegria", "Raiva", "Medo", "Tristeza"],
      },
      {
        name: "Eu e o mundo",
        permissions: ["Ter sucesso", "Pensar", "Saber", "Crescer"],
      },
      {
        name: "Eu e os outros",
        permissions: ["Ser criança", "Ser próximo", "Pertencer", "Confiar"],
      },
      {
        name: "Eu e eu mesmo",
        permissions: ["Prazer", "Ser eu mesmo", "Saúde", "Existir"],
      },
    ],
    copyLink: "Copiar link",
    copied: "Link copiado!",
  },
}

// stolen from: https://stackoverflow.com/a/28553412/149872
function wrap(text, width) {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy")) || 0,
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", 0)
        .attr("y", y)
        .attr("dy", dy + "em")
    while ((word = words.pop())) {
      line.push(word)
      tspan.text(line.join(" "))
      if (tspan.node().getComputedTextLength() > width) {
        line.pop()
        tspan.text(line.join(" "))
        line = [word]
        tspan = text
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word)
      }
    }
  })
}

const svgBox = document.getElementById("svgBox")

const radius = 310
const n = 16

let CURRENT_LANGUAGE = "en"

// translatable strings
let PERMISSIONS = null
let QUADRANT_NAMES = null
let WHEEL_TITLE = null

const NUM_LEVELS = 10

// permissions data
let PERMISSION_LEVELS = Array.from({ length: 16 }, () => 0)

const setLanguage = (newLang) => {
  CURRENT_LANGUAGE = newLang
  PERMISSIONS = TRANSLATIONS[CURRENT_LANGUAGE].quadrants.reduce(
    (acc, { permissions }) => [...acc, ...permissions],
    [],
  )
  QUADRANT_NAMES = TRANSLATIONS[CURRENT_LANGUAGE].quadrants.map(({ name }) => name)
  WHEEL_TITLE = TRANSLATIONS[CURRENT_LANGUAGE].title
}

const calcAngle = (i, n) => {
  const start = (i / n) * 2 * Math.PI
  const end = ((i + 1) / n) * 2 * Math.PI
  return [start, end]
}

const clearWheel = () => {
  d3.select(svgBox).selectAll("*").remove()
}

const drawWheel = () => {
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
    let [xPos, yPos] = labelArc.centroid(angle)
    xPos = xPos - permLabel.length * 5 // hacky way to position text considering label length
    d3.select(svgBox)
      .append("text")
      .attr("fill", "#223344")
      .attr("font-size", "1.5em")
      .attr("transform", `translate(${xPos}, ${yPos})`)
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

  // draw quadrant labels
  const drawTextBox = (textContent, xPos, yPos) => {
    const textWidth = 120
    const g = d3.select(svgBox).append("g")
    g.append("rect")
      .attr("stroke", "#223344")
      .attr("fill", "transparent")
      .attr("x", xPos)
      .attr("y", yPos)
      .attr("width", textWidth)
      .attr("height", 70)
    var text = g
      .append("text")
      .attr("transform", `translate(${xPos + 15}, ${yPos + 30})`)
      .attr("font-size", "1.2em")
      .text(textContent)
      .call(wrap, textWidth - 15)
  }

  drawTextBox(QUADRANT_NAMES[0], 250, -350)
  drawTextBox(QUADRANT_NAMES[1], 250, 250)
  drawTextBox(QUADRANT_NAMES[2], -380, 250)
  drawTextBox(QUADRANT_NAMES[3], -380, -350)

  // set wheel title
  d3.select("#wheel-title").text(WHEEL_TITLE)
}

// setup events
const isRainbowMode = () => {
  try {
    const params = new URLSearchParams(new URL(document.URL).search)
    return params.get("rainbow") === "1"
  } catch (err) {
    return false
  }
}

const getColor = (permission) => {
  const defaultColor = "#4444aa"
  if (isRainbowMode()) {
    return d3.interpolateRainbow(permission / PERMISSIONS.length - 0.7)
  }
  return defaultColor
}

const resetPermissionSectorFromDOMElement = (sectorElement) => {
  const data = JSON.parse(sectorElement.getAttribute("data"))
  svgBox
    .querySelectorAll(`.permission_${data.permission}`)
    .forEach((el) => el.setAttribute("fill", "transparent"))
  const defaultColor = "#4444aa"
  sectorElement.setAttribute("fill", data.level === 0 ? defaultColor : getColor(data.permission))

  // update permission level
  PERMISSION_LEVELS[data.permission] = data.level
}

const resetPermissionSectorFromData = (permissionIndex, sectorLevel) => {
  const sectorElement = svgBox.querySelector(`.permission_${permissionIndex}.level_${sectorLevel}`)
  if (sectorElement) {
    resetPermissionSectorFromDOMElement(sectorElement)
  }
}

const resetPermissionSectorIfDraggedInsideSector = (element) => {
  if (!draggedElement) {
    return
  }
  const draggedElementData = JSON.parse(draggedElement.getAttribute("data"))
  const elementData = JSON.parse(element.getAttribute("data"))
  if (draggedElementData.permission === elementData.permission) {
    resetPermissionSectorFromDOMElement(element)
  }
}

// define a variable to store the current dragged element
let draggedElement = null

const handleDragStart = (event) => {
  draggedElement = event.target
}

const handleDragEnd = (event) => {
  resetPermissionSectorIfDraggedInsideSector(event.target)
  draggedElement = null
}

const handleMouseOver = (event) => {
  resetPermissionSectorIfDraggedInsideSector(event.target)
}

const handleTouchOrClick = (event) => {
  if (draggedElement === event.target) {
    // if the element was dragged and then released, do nothing
    return
  }
  resetPermissionSectorFromDOMElement(event.target)
}

const setupEvents = () => {
  svgBox.querySelectorAll(".permission").forEach((sectorElem) => {
    sectorElem.addEventListener("mousedown", handleDragStart)
    sectorElem.addEventListener("mouseup", handleDragEnd)
    sectorElem.addEventListener("mouseover", handleMouseOver)
    sectorElem.addEventListener("touchstart", handleDragStart)
    sectorElem.addEventListener("touchend", handleDragEnd)
    sectorElem.addEventListener("click", handleTouchOrClick)
  })
}

const loadParameterFromUrl = (parameterName) => {
  try {
    const params = new URLSearchParams(new URL(document.URL).search)
    return params.get(parameterName)
  } catch (err) {
    console.error(err)
  }
  return null
}

const loadPermissionLevelsFromUrl = () => {
  permissionLevels = loadParameterFromUrl("permissions")
  if (permissionLevels) {
    return permissionLevels.split(",")
  }
  return null
}

const setPermissionLevels = (permissionLevels) => {
  if (!permissionLevels) {
    return
  }
  permissionLevels.forEach((level, permissionIndex) => {
    resetPermissionSectorFromData(permissionIndex, level)
  })
}

const generateUrl = () => {
  const permissionLevels = PERMISSION_LEVELS.map((level) => String(level))
  const url = new URL(document.URL)
  url.searchParams.set("permissions", permissionLevels.join(","))
  url.searchParams.set("rainbow", isRainbowMode() ? "1" : "0")
  url.searchParams.set("lang", CURRENT_LANGUAGE)
  return url.toString()
}

const copyUrlToClipboard = () => {
  const url = generateUrl()
  console.log(url)
  navigator.clipboard.writeText(url)
  const copyBtn = document.querySelector("#copyButton")
  copyBtn.innerHTML = TRANSLATIONS[CURRENT_LANGUAGE].copied
  setTimeout(() => {
    copyBtn.innerHTML = TRANSLATIONS[CURRENT_LANGUAGE].copyLink
  }, 2000)
}

const loadLanguageFromUrl = () => {
  return loadParameterFromUrl("lang") || "en"
}

const switchLanguage = (lang) => {
  setLanguage(lang)
  clearWheel()
  drawWheel()
  setupEvents()
  setPermissionLevels(PERMISSION_LEVELS)
  const copyBtn = document.querySelector("#copyButton")
  copyBtn.innerHTML = TRANSLATIONS[CURRENT_LANGUAGE].copyLink
}

setLanguage(loadLanguageFromUrl())
drawWheel()
setupEvents()
setPermissionLevels(loadPermissionLevelsFromUrl())
