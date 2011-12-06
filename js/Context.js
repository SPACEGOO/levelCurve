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