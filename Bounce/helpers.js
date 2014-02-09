/**
 * Convert Angle Degrees to Radians
 * and shift angle to -90 so 0 is represent UP direction
 */
function rad( angle ) {
	var radians = (Math.PI / 180) * (angle - 90);
	return radians;
}


/**
 * Alias for get element by id
 */
function $(id) {
	return document.getElementById(id);	
} 



	