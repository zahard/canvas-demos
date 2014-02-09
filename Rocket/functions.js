
/**
 * Convert radians to degrees
 */
function rad( angle ) {
	var radians = (Math.PI/180)*angle;
	return radians;
}


function randomFromInterval(from,to){
    return Math.floor(Math.random()*(to-from+1)+from);
}

function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}


function extend(Child, Parent) {
	var F = function() { }
	F.prototype = Parent.prototype
	Child.prototype = new F()
	Child.prototype.constructor = Child
	Child.superclass = Parent.prototype
}