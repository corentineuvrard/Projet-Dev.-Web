var stonePosition;
var nbCoups;
var marque = [];

// Object coordinates
function coordinate(x, y)
{
    this.x = x;
    this.y = y;
}

// Track the mouse position
function getMousePosition(e)
{
    var posX = e.clientX;
    var posY = e.clientY;

    var mousePosition = new coordinate(posX, posY);

    return mousePosition;
}

// Draw a stone tracking the mouse cursor
function trackingStone(e, size)
{
    var svgNS = "http://www.w3.org/2000/svg";
    var svgDOM = document.getElementsByTagName("svg")[0];
    var stone = document.createElementNS(svgNS,"circle");
    var stonePos = getMousePosition(e);
    var bclient = document.getElementById("grid").getBoundingClientRect();

    // Translate the mouse coordinates from the client to the grid
    stonePos.x = Math.round(((stonePos.x - bclient.left) / ((svgDOM.getAttribute("width") * 10) / (size * 10 + 10))) * 10);
    stonePos.y = Math.round(((stonePos.y - bclient.top) / ((svgDOM.getAttribute("height") * 10) / (size * 10 + 10))) * 10);

    fitGrid(stone, stonePos, size);
}

// Get the color of the current player
function getColor()
{
  if (nbCoups == null) nbCoups = 1;

  if (nbCoups % 2 == 0)
    var color = "white";
  else
    var color = "black";

  return color;
}

// Adapt the position of the stone to the grid
function fitGrid(stone, stonePos, size)
{
	if ((stonePos.x % 10) < 5)
    stonePos.x = stonePos.x - (stonePos.x % 10);
	if ((stonePos.x % 10) >= 5)
    stonePos.x = stonePos.x + (10 - (stonePos.x % 10));

	if ((stonePos.y % 10) < 5)
    stonePos.y = stonePos.y - (stonePos.y % 10);
	if ((stonePos.y % 10) >= 5)
    stonePos.y = stonePos.y + (10 - (stonePos.y % 10));

  var idTracker = getLabels(stonePos);

	// Attributes of the stone
	stone.setAttribute("id", idTracker);
  stone.setAttribute("class", "tracker");
  stone.setAttribute("r", 3);
  stone.setAttribute("stroke", getColor());
  stone.setAttribute("stroke-width", 0.5);
  stone.setAttribute("stroke-opacity", 0.5);
  stone.setAttribute("fill", getColor());
  stone.setAttribute("fill-opacity", 0.5);

  // Check if the tracker is in the goban
  if((stonePos.x >= 0) && (stonePos.x <= (size * 10 - 10)) && (stonePos.y >= 0) && (stonePos.y <= (size * 10 - 10)))
  {
    // Create a tracker at the position of the mouse
  	if (document.getElementById(getLabels(stonePos)) == null)
  	{
      // Create a tracker if there is no tracker on the goban
  		if (document.getElementsByClassName("tracker").length == 0)
	    {
        stone.setAttribute("cx", stonePos.x);
        stone.setAttribute("cy", stonePos.y);
       	document.getElementById("goban").appendChild(stone);

        // Add an event listener if the position of the tracker is valid for a new stone put by the player
        if (!isCaptured(idTracker))
       	  document.getElementById(idTracker).addEventListener("click", placeStone);
	    }
      // Update the position of the tracker if it is necessary
	    else if (document.getElementsByClassName("tracker")[0].getAttribute("cx") != stonePos.x || document.getElementsByClassName("tracker")[0].getAttribute("cy") != stonePos.y)
	    {
        document.getElementsByClassName("tracker")[0].setAttribute("cx", stonePos.x);
        document.getElementsByClassName("tracker")[0].setAttribute("cy", stonePos.y);
        document.getElementsByClassName("tracker")[0].setAttribute("stroke", getColor());
        document.getElementsByClassName("tracker")[0].setAttribute("fill", getColor());
        document.getElementsByClassName("tracker")[0].setAttribute("id", idTracker);

        // Add or remove the event listener of the tracker according to its position relative to other stones
        if (!isCaptured(idTracker))
          document.getElementsByClassName("tracker")[0].addEventListener("click", placeStone);
        else
          document.getElementsByClassName("tracker")[0].removeEventListener("click", placeStone);

        marque = [];
	    }
	    stonePosition = new coordinate(stonePos.x, stonePos.y);
  	}
  }
}

// Place a stone on the goban
function placeStone()
{
	var svgNS = "http://www.w3.org/2000/svg";
  var svgDOM = document.getElementsByTagName("svg")[0];
  var stone = document.createElementNS(svgNS,"circle");
  var id = getLabels(stonePosition);

  // Attributes of the stone
  stone.setAttribute("id", id);
  stone.setAttribute("r", 3);
  stone.setAttribute("stroke", getColor());
  stone.setAttribute("stroke-width", 0.5);
  stone.setAttribute("fill", getColor());
  stone.setAttribute("fill-opacity", 1);
  stone.setAttribute("cx", stonePosition.x);
  stone.setAttribute("cy", stonePosition.y);

  document.getElementById("goban").appendChild(stone);
  checkSides(id);

  nbCoups += 1;
}

// Get the size of the goban
function getGobanSize()
{
  // Get the viewBox parameters
  var viewBoxParams = document.querySelector('svg').getAttribute('viewBox').split(/\s+|,/);
  var x_min = 0;
  var y_min = 0;
  var x_max = viewBoxParams[2] - 20;
  var y_max = viewBoxParams[3] - 20;

  var gobanSize = [x_min, y_min, x_max, y_max];

  return gobanSize;
}

// Convert coordinates with the corresponding labels
function getLabels(position)
{
  var gobanSize = getGobanSize();

	// Get the position on X axe
	if (position.x >= gobanSize[0] && position.x <= gobanSize[2])
    var coordX = String.fromCharCode((position.x / 10) + 65);
  else
    var coordX = null;

	// Get the position on Y axe
	if (position.y >= gobanSize[1] && position.y <= gobanSize[3])
    var coordY = (position.y + 10) / 10;
  else
    var coordY = null;

  if (coordX != null && coordY != null)
	 var coord = coordX + coordY;
  else
    coord = null;

	return coord;
}

// Convert labels with the corresponding coordinates
function getPosition(labels)
{
	// Get the coordinate on X axe
	var coordX = labels.match(/[A-Z]+/g);
  coordX = coordX[0];
	var posX = coordX.charCodeAt(0) - 65;
	if (posX > 0)
    posX *= 10;
	else
    posX = 0;

	// Get the coordinate on Y axe
	var coordY = labels.match(/\d+/g);
	var posY = (coordY * 10) - 10;

	var position = new coordinate(posX, posY);

	return position;
}

// Check if a position is in the goban
function isInGoban(x, y)
{
  // Get the goban size
  var gobanSize = getGobanSize();

  if (x < gobanSize[0] || x > gobanSize[2] || y < gobanSize[1] || y > gobanSize[3])
    return false;
  else
    return true;
  }

// Get the neeighbours of a stone
function getNeighbours(id)
{
  var position = getPosition(id);
  var x = position.x;
  var y = position.y;
  
  var neighbours = [];
  neighbours.push(document.getElementById(getLabels(new coordinate(x, y - 10))));  // top
  neighbours.push(document.getElementById(getLabels(new coordinate(x, y + 10))));  // bottom
  neighbours.push(document.getElementById(getLabels(new coordinate(x - 10, y))));  // left
  neighbours.push(document.getElementById(getLabels(new coordinate(x + 10, y))));  // right

  return neighbours;
}

// Check the neighbours of the stone that has been put on the goban
function checkSides(id)
{
  var color = document.getElementById(id).getAttribute("fill");
  var neighbours = getNeighbours(id);

  for (var i = 0; i < neighbours.length; i++)
  {
    if (neighbours[i] != null)
      // Check if the neighbour is of a different color
      if (neighbours[i].getAttribute("fill") != color)
        // Check if the neighbour has been captured by the stone put on the goban
        if (isCaptured(neighbours[i].getAttribute("id")))
          // Remove the captured stones from the goban
          for (var j = 0; j < marque.length; j++)
            document.getElementById("goban").removeChild(document.getElementById(marque[j]));
    marque = [];
  }
}

// Return if a stone is captured
function isCaptured(id)
{
  var color = document.getElementById(id).getAttribute("fill");
  var neighbours = getNeighbours(id);
  var position = getPosition(id);
  var notFree = true;

  // Check if the stone has been already checked
  if (!marque.includes(id))
    marque.push(id);

  for (var i = 0; i < neighbours.length; i++)
  {
    // Check the degree of liberty of the stone
    if (neighbours[i] == null)
    {
      switch (i)
      {
        // top
        case 0 :
          if (isInGoban(position.x, position.y - 10))
            notFree = false;
          break;
        // bottom
        case 1 :
          if (isInGoban(position.x, position.y + 10))
            notFree = false;
          break;
        // left
        case 2 :
          if (isInGoban(position.x - 10, position.y))
            notFree = false;
          break;
        // right
        case 3 :
          if (isInGoban(position.x + 10, position.y))
            notFree = false;
          break;
      }
    }
    else
    {
      // Check if the current neighbour is of a different color and if it has been already checked
      if (neighbours[i].getAttribute("fill") == color && !marque.includes(neighbours[i].getAttribute("id")))
        // Call the function on the neighbours of the stone that has been checked
        notFree = isCaptured(neighbours[i].getAttribute("id"));
    }

    // Return false if the stone or group of stones has at least one degree of freedom
    if (!notFree)
      break;
  }

  return notFree;
}
