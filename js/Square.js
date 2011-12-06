


LEVELCURVEAPI.Square = function (A, deltaX, deltaY) 
{
	var that = {};
	that.A=A;
	that.deltaX=deltaX;
	that.deltaY=deltaY || deltaX; // si non défini : carré
	
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