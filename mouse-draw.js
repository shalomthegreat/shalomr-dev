document.addEventListener("DOMContentLoaded", function () {
  // Get the SVG element
  const svgns = "http://www.w3.org/2000/svg";
  const root = document.querySelector("#hero-mouse");

  // Only proceed if the SVG element exists
  if (!root) {
    console.error("#hero-mouse SVG element not found");
    return;
  }

  // ===== CUSTOMIZABLE PARAMETERS =====
  // Feel free to modify these values to dial in the perfect effect
  const config = {
    // Color of the lines (any valid CSS color)
    lineColor: "black",

    // Number of lines in the trail (more lines = smoother trail but more CPU intensive)
    // Recommended range: 10-30
    lineCount: 20,

    // How quickly the lines follow the mouse (lower = smoother, higher = more responsive)
    // Recommended range: 0.05-0.3
    followSpeed: 0.3,

    // Width of the lines
    // Recommended range: 1-3
    lineWidth: 2,

    // How quickly the opacity fades for trailing lines
    // 1.0 = linear fade, higher values = faster fade at the end
    // Recommended range: 1.0-3.0
    opacityDropoff: 1.5,

    // Maximum opacity of the first line
    // Recommended range: 0.5-1.0
    maxOpacity: 0.9
  };
  // ===================================

  const lines = [];

  // Initialize positions
  const mouse = { x: 0, y: 0 };
  const positions = [];

  // Create initial positions for all lines
  for (let i = 0; i < config.lineCount; i++) {
    positions.push({
      x: 0,
      y: 0,
      oldX: 0,
      oldY: 0
    });

    // Create the line element
    const line = document.createElementNS(svgns, "line");
    line.setAttribute("stroke", config.lineColor);
    line.setAttribute("stroke-width", config.lineWidth);

    // Calculate opacity with custom dropoff
    const opacity = config.maxOpacity * Math.pow(1 - i / config.lineCount, config.opacityDropoff);
    line.setAttribute("stroke-opacity", opacity);

    root.appendChild(line);
    lines.push(line);
  }

  // Track mouse movement (account for scroll offset)
  window.addEventListener("mousemove", function (event) {
    mouse.x = event.clientX + window.scrollX;
    mouse.y = event.clientY + window.scrollY;
  });

  // Animation loop
  function animate() {
    // Update the first position to follow the mouse
    positions[0].oldX = positions[0].x;
    positions[0].oldY = positions[0].y;
    positions[0].x = mouse.x;
    positions[0].y = mouse.y;

    // Update all other positions to follow the one before them
    for (let i = 1; i < config.lineCount; i++) {
      positions[i].oldX = positions[i].x;
      positions[i].oldY = positions[i].y;
      positions[i].x += (positions[i - 1].x - positions[i].x) * config.followSpeed;
      positions[i].y += (positions[i - 1].y - positions[i].y) * config.followSpeed;

      // Update line attributes
      lines[i - 1].setAttribute("x1", positions[i - 1].x);
      lines[i - 1].setAttribute("y1", positions[i - 1].y);
      lines[i - 1].setAttribute("x2", positions[i].x);
      lines[i - 1].setAttribute("y2", positions[i].y);
    }

    requestAnimationFrame(animate);
  }

  // Start the animation
  animate();
});
