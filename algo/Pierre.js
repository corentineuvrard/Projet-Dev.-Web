var stonePosition;

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

// Adapt the position of the stone to the grid
function fitGrid(stone, stonePos, size)
{
	if((stonePos.x % 10) < 5)	stonePos.x = stonePos.x - (stonePos.x % 10);
	if((stonePos.x % 10) >= 5)	stonePos.x = stonePos.x + (10 - (stonePos.x % 10));

	if((stonePos.y % 10) < 5)	stonePos.y = stonePos.y - (stonePos.y % 10);
	if((stonePos.y % 10) >= 5)	stonePos.y = stonePos.y + (10 - (stonePos.y % 10));

	// Attributes of the stone
	stone.setAttribute("id", "stone");
    stone.setAttribute("r", 3);
    stone.setAttribute("stroke", "black");
    stone.setAttribute("stroke-width", 0.5);
    stone.setAttribute("stroke-opacity", 0.5);
    stone.setAttribute("fill", "black");
    stone.setAttribute("fill-opacity", 0.5);

    // Create the stone or update its position
    if((stonePos.x >= 0) && (stonePos.x <= (size * 10 - 10)) && (stonePos.y >= 0) && (stonePos.y <= (size * 10 - 10)))
    {
    	if(document.getElementById("stone") == null)
	    {
	       	document.getElementById("goban").appendChild(stone);
	       	document.getElementById("stone").onclick = placeStone;
	    }
	    else
	    {
	    	document.getElementById("stone").setAttribute("cx", stonePos.x);
	    	document.getElementById("stone").setAttribute("cy", stonePos.y);
	    }
	    stonePosition = new coordinate(stonePos.x, stonePos.y);
    }
}
    
// Place a stone on the goban
function placeStone()
{
	var svgNS = "http://www.w3.org/2000/svg";
    var svgDOM = document.getElementsByTagName("svg")[0];
    var stone = document.createElementNS(svgNS,"circle");

    // Attributes of the stone
    stone.setAttribute("r", 3);
    stone.setAttribute("stroke", "black");
    stone.setAttribute("stroke-width", 0.5);
    stone.setAttribute("fill", "black");
    stone.setAttribute("fill-opacity", 1);
    stone.setAttribute("cx", stonePosition.x);
    stone.setAttribute("cy", stonePosition.y);

    document.getElementById("goban").appendChild(stone);
}