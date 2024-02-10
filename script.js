document.addEventListener('DOMContentLoaded', function() {
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
    const margin = 30;
    const cellSize = 120;
    const rows = 6;
    const cols = 9;
    const firstColor = '#E03616';
    const secondColor = '#FFF689';
    canvas.width = 2*margin + cellSize * cols;
    canvas.height = 2*margin + cellSize * rows;

    // Initialize field
    var field = Array(cols+1);
    for (var i = 0; i < field.length; i++) {
	field[i] = Array(rows+1);
	for (var j = 0; j < field[i].length; j++) {
	    if (i == 0 || i == cols || j == 0 || j == rows) {
		field[i][j] = Math.floor(Math.random()*2)+1;
	    } else {
		field[i][j] = 0;
	    }
	}
    }

    // Initialize lines
    var lines = Array(cols);
    for (var i = 0; i < lines.length; i++) {
	lines[i] = Array(rows);
	for (var j = 0; j < lines[i].length; j++) {
	    lines[i][j] = Math.floor(Math.random()*2)+1;
	}
    }

    // Get the coordinates of all points that are connected to the
    // line in cell (x, y).
    function connectedComponent(x, y) {
	stack = [];
	done = [];
	if (lines[x][y] == 1) {
	    stack.push([x, y+1]);
	    stack.push([x+1, y]);
	} else if (lines[x][y] == 2) {
	    stack.push([x, y]);
	    stack.push([x+1, y+1]);
	}
	while (stack.length > 0) {
	    element = stack.pop();
	    done.push(element);
	    if (field[element[0]][element[1]] > 0) continue;
	    x = element[0];
	    y = element[1];
	    candidates = [];
	    if (x > 0 && y > 0 && lines[x-1][y-1] == 2) candidates.push([x-1, y-1]);
	    if (x < cols && y > 0 && lines[x][y-1] == 1) candidates.push([x+1, y-1]);
	    if (x > 0 && y < rows && lines[x-1][y] == 1) candidates.push([x-1, y+1]);
	    if (x < cols && y < rows && lines[x][y] == 2) candidates.push([x+1, y+1]);
	    candidates = candidates.filter(pair1 =>
		!stack.some(pair2 => pair1[0] === pair2[0] && pair1[1] === pair2[1]));
	    candidates = candidates.filter(pair1 =>
		!done.some(pair2 => pair1[0] === pair2[0] && pair1[1] === pair2[1]));
	    for (i = 0; i < candidates.length; i++) {
		stack.push(candidates[i]);
	    }
	}
	return done;
    }
    console.log(connectedComponent(4, 4));

    // Function to draw a circle
    function drawCircle(x, y, radius, color) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2, false);
	ctx.fillStyle = color;
	ctx.fill();
	ctx.closePath();
    }

    function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Draw grid
	ctx.strokeStyle = '#343434';
	for (var x = 0; x <= cols; x++) {
	    ctx.lineWidth = 2;
	    ctx.beginPath();
	    ctx.moveTo(margin + x*cellSize, margin);
	    ctx.lineTo(margin + x*cellSize, margin + rows*cellSize);
	    ctx.stroke();
	}
	for (var y = 0; y <= rows; y++) {
	    ctx.lineWidth = 2;
	    ctx.beginPath();
	    ctx.moveTo(margin, margin + y*cellSize);
	    ctx.lineTo(margin + cols*cellSize, margin + y*cellSize);
	    ctx.stroke();
	}
	
	// Draw diagonal lines
	for (var x = 0; x < lines.length; x++) {
	    for (var y = 0; y < lines[x].length; y++) {
		console.log("x: " + x + " y: " + y);
		cc = connectedComponent(x, y);
		console.log(cc);
		color1 = false;
		color2 = false;
		for (var i = 0; i < cc.length; i++) {
		    if (field[cc[i][0]][cc[i][1]] == 1) color1 = true;
		    if (field[cc[i][0]][cc[i][1]] == 2) color2 = true;
		}
		if (color1 && !color2) ctx.strokeStyle = firstColor;
		if (color2 && !color1) ctx.strokeStyle = secondColor;
		if (color1 && color2) ctx.strokeStyle = 'black';
		if (!color1 && !color2) ctx.strokeStyle = 'black';
		if (lines[x][y] == 1) {
		    ctx.lineWidth = 10;
		    ctx.beginPath();
		    ctx.moveTo(margin + x*cellSize, margin + (y+1)*cellSize);
		    ctx.lineTo(margin + (x+1)*cellSize, margin + y*cellSize);
		    ctx.stroke();
		    drawCircle(margin+(x+1)*cellSize, margin+y*cellSize, 5, ctx.strokeStyle); // No circle
		    drawCircle(margin+x*cellSize, margin+(y+1)*cellSize, 5, ctx.strokeStyle); // No circle

		}
		if (lines[x][y] == 2) {
		    ctx.lineWidth = 10;
		    ctx.beginPath();
		    ctx.moveTo(margin + x*cellSize, margin + y*cellSize);
		    ctx.lineTo(margin + (x+1)*cellSize, margin + (y+1)*cellSize);
		    ctx.stroke();
		    drawCircle(margin+x*cellSize, margin+y*cellSize, 5, ctx.strokeStyle); // No circle
		    drawCircle(margin+(x+1)*cellSize, margin+(y+1)*cellSize, 5, ctx.strokeStyle); // No circle
		}
	    }
	}

	for (var x = 0; x < field.length; x++) {
	    for (var y = 0; y < field[x].length; y++) {
		if (field[x][y] == 1) {
		    drawCircle(margin+x*cellSize, margin+y*cellSize, 20, '#000000'); // Red circle
		    drawCircle(margin+x*cellSize, margin+y*cellSize, 18, firstColor); // Red circle
		}
		if (field[x][y] == 2) {
		    drawCircle(margin+x*cellSize, margin+y*cellSize, 20, '#000000'); // Red circle
		    drawCircle(margin+x*cellSize, margin+y*cellSize, 18, secondColor); // Red circle
		}
	    }
	}
    }

    draw();

    canvas.addEventListener('click', function(event) {
	var rect = canvas.getBoundingClientRect();
	var x = event.clientX - rect.left;
	var y = event.clientY - rect.top;
	var col = Math.floor((x - margin) / cellSize);
	var row = Math.floor((y - margin) / cellSize);

	if (row >= 0 && row < rows && col >= 0 && col < cols) {
	    lines[col][row] = lines[col][row] == 1 ? 2 : 1;
	    draw();
	}
    });
});

