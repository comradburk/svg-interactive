angular
	.module('svg-interactive.utilities', [])
	.factory('utilities', [function() {
		return {
			translateCoordinatesScreenToSVG: function(svgElement, xScreenCoordinate, yScreenCoordinate) {
				var point = element[0].createSVGPoint();
				point.x = xScreenCoordinate;
				point.y = yScreenCoordinate;
				return point.matrixTransform(element[0].getScreenCTM().inverse());
			}
		};
	}]);