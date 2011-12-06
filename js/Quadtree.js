LEVELCURVEAPI.Quadtree = function (square, density, prof, debug)
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
