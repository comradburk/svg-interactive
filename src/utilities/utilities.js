angular
	.module('svg-interactive.utilities', [])
	.factory('utilities', [function() {
		return {
			translateCoordinatesScreenToSVG: function(svgElement, xScreenCoordinate, yScreenCoordinate) {
				var point = svgElement[0].createSVGPoint();
				point.x = xScreenCoordinate;
				point.y = yScreenCoordinate;
				return point.matrixTransform(svgElement[0].getScreenCTM().inverse());
			}
		};
	}]);