
var CV, CTX;

// iso-surfaces tests
function surface (p) {
	var x= (p[0]-300);
	var y = (p[1]-300);
	return Math.cos(x/50)*x*x+ y*y - 10000;
}

function surface2 (p) {
	var x= (p[0]-300);
	var y = (p[1]-300);
	return 5*x*x + y*y - 10000;
}


function main () {
	CV = document.getElementById("canvas");
	CTX = CV.getContext("2d");
	CTX.strokeStyle="blue";
	CTX.levelCurve(surface, 0, 0, 600, 600);
	CTX.strokeStyle="red";
	CTX.levelCurve(surface2, 0, 0, 600, 600);
}