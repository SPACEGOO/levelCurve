var LEVELCURVEAPI = {
	MAXPROF: 7,
	DEBUG: false,
	lookup_edges : {
		"0000": [],
		"0001": [2, 3],
		"0010": [1, 2],
		"0100": [0, 1],
		"1000": [3, 0],
		"0011": [1, 3],
		"0101": [0, 1, 2, 3],
		"1001": [0, 2], //
		"0110": [0, 2], //
		"1010": [1, 2, 3, 0], //
		"1100": [1, 3], //
		"0111": [3, 0], //
		"1011": [0, 1],
		"1101": [1, 2],
		"1110": [2, 3],
		"1111": []
		}
};

// adding method to CanvasRenderingContext2D
/* 
 * @params: 
 *  equation : must take a 2-array as input and return a float example : function (p) { return p[0] ; }
 *  x, y, width, height: rectangle where you want draw your curve
 *  prof [optional] : integer (7 by default). Put higher values to get more precision (may be time consumer)
 *  debug [optional] : draw the computed quadtree in a light mode. 
 */

CanvasRenderingContext2D.prototype.levelCurve = function (equation, x, y, width, height, prof, debug)
{
	if (typeof(prof) !== 'undefined') {
		LEVELCURVEAPI.MAXPROF = prof;
	}
	var DEBUG = (typeof(debug) === 'undefined') ? LEVELCURVEAPI.DEBUG : debug;
	var zou = LEVELCURVEAPI.Square([x, y], width, height);
	LEVELCURVEAPI.Quadtree(zou, equation, LEVELCURVEAPI.MAXPROF, DEBUG);
	LEVELCURVEAPI.MAXPROF=7;
}


LEVELCURVEAPI.Square = function (A, deltaX, deltaY) 
{
	var that = {};
	that.A=A;
	that.deltaX=deltaX;
	that.deltaY=deltaY || deltaX; // si non d�fini : carr�
	
	that.coeff = [];
	that.dualVertices = [];
	that.edgesValue = "";
	that.preEvaluated = false;
	
	that.primVertices = function (i)
	{
		switch (i) {
			case 0:
			return that.A;
			case 1:
			return [that.A[0]+that.deltaX, that.A[1]];
			case 2:
			return [that.A[0]+that.deltaX, that.A[1]+that.deltaY];
			case 3:
			return [that.A[0], that.A[1]+that.deltaY];
			default:
		}
	}
	
	that.preEvaluate = function (density)
	{
		if (!that.preEvaluated) {
			for (var i = 0 ; i < 4; ++i) {
				var zde = density(that.primVertices(i));
				that.coeff [i] = zde;
				that.edgesValue += (zde < 0) ? '1' : '0';
			}
			that.preEvaluated = true;
		}
	}
	
	that.evaluate = function (density)
	{
		that.preEvaluate (density);
		var ed = LEVELCURVEAPI.lookup_edges[that.edgesValue];
		for (var i = 0 ; i < ed.length; i++)
		{
			// interest point
			var from = ed[i];
			var to = (from < 3) ? from+1 : 0;
			// coeffs
			var c1 = Math.abs(that.coeff[from]);
			var c2 = Math.abs(that.coeff[to]);
			var a = c1 / (c1 + c2);
			var b = c2 / (c1 + c2);
			// building edge :	
			that.dualVertices.push(LEVELCURVEAPI.lib_vector.bary(that.primVertices(from), that.primVertices(to), b, a));
		}
	}
	
	that.draw = function (debug)
	{
		if (debug) {
			CTX.save ();
			CTX.strokeStyle="lightgrey";
			CTX.beginPath ();
			CTX.moveTo(A[0], A[1]);
			for (var i = 0 ; i < 4 ; ++i) {
				CTX.lineTo(that.primVertices(i)[0], that.primVertices(i)[1]);
			}
			CTX.stroke ();
			CTX.restore ();
		}
		
		CTX.beginPath();
		for (var i = 0 ; i < that.dualVertices.length; i+=2)
		{
			CTX.moveTo(that.dualVertices[i][0], that.dualVertices[i][1]);
			CTX.lineTo(that.dualVertices[i+1][0], that.dualVertices[i+1][1]);
		}
		CTX.stroke ();
	}
	
	return that;
};
LEVELCURVEAPI.lib_vector = {
	bary: function (u, v, a, b)
	{
		return [a*u[0] + b*v[0], a*u[1] + b*v[1]];
	}
};LEVELCURVEAPI.Quadtree = function (square, density, prof, debug)
{
	var that = {};
	that.square = square;
	that.childs = [];
	that.prof = prof;
	
	if (prof > 0)
	{
		if (debug) {
			that.square.draw (true);
		}
		that.square.preEvaluate (density);
		// s'il faut splitter
		if ((that.square.edgesValue !== "0000" && that.square.edgesValue !== "1111") || that.prof === LEVELCURVEAPI.MAXPROF)
		{
			var a = square.primVertices(0);
			var dx = that.square.deltaX * 0.5;
			var dy = that.square.deltaY * 0.5;
			var tl = LEVELCURVEAPI.Square(a, dx, dy);
			var tr = LEVELCURVEAPI.Square([a[0] + dx, a[1]], dx, dy);
			var bl = LEVELCURVEAPI.Square([a[0], a[1]+dy], dx, dy);
			var br = LEVELCURVEAPI.Square([a[0] + dx, a[1]+dy], dx, dy);
			var topLeft = LEVELCURVEAPI.Quadtree(tl, density, that.prof-1, debug);
			var topRight = LEVELCURVEAPI.Quadtree(tr, density, that.prof-1, debug);  
			var bottomRight = LEVELCURVEAPI.Quadtree(br, density, that.prof-1, debug);
			var bottomLeft = LEVELCURVEAPI.Quadtree(bl, density, that.prof-1, debug);
			that.childs.push(topLeft, topRight, bottomLeft, bottomRight);
		}
	} // sinon on dessine
	else {
		that.square.evaluate (density);
		that.square.draw (debug);
	}	
	return that;
};
