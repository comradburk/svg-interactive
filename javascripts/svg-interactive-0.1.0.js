/*
 * svg-interactive
 * Version: 0.1.0 - 2014-07-27
 * License: MIT
 */
angular.module("svg-interactive", ["svg-interactive.zoomable", "svg-interactive.pannable", "svg-interactive.utilities"]);
angular
	.module('svg-interactive.pannable', ['svg-interactive.utilities'])
	.directive('pannable', ['utilities', function (utilities) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var initialPoint,
					initialCursor;

				// Pan svg canvas
				function pan(event) {
					var viewBoxValues = attrs.viewbox.split(' ').map(function(value) {
						return parseInt(value, 10);
					}),
					point = utilities.translateCoordinatesScreenToSVG(element, event.clientX, event.clientY);

					viewBoxValues[0] -= (point.x - initialPoint.x);
					viewBoxValues[1] -= (point.y - initialPoint.y);
					
					attrs.$set('viewbox', viewBoxValues.join(' '));

					event.preventDefault();
				}
				
				function initiatePan(event) {
					// Get initial point to 
					initialPoint = utilities.translateCoordinatesScreenToSVG(element, event.clientX, event.clientY);
					
					initialCursor = element.css('cursor') === '' ? 'auto' : element.css('cursor');
					element.css('cursor', 'move');

					// Add events for panning
					element.on('mousemove', pan);
					element.on('mouseup', endPan);
					
					event.stopPropagation();
					event.preventDefault();
				}

				// Remove pan events
				function endPan(event) {
					element.css('cursor', initialCursor);
					element.off('mousemove', pan);
					element.off('mouseup', endPan);
				}

				element.on('mousedown', initiatePan);
			}
		}
    }]);
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
angular
	.module('svg-interactive.zoomable', ['svg-interactive.utilities'])
	.directive('zoomable', ['utilities', function (utilities) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
			// Default zoom rate
			var zoomRate = 1.1;
			var enabled = true;
			
			attrs.$observe('zoomRate', function(value) {
			  if (angular.isDefined(value)) {
				  zoomRate = parseFloat(value);
			  }
			});
			attrs.$observe('zoomable', function(value) {
			  if (angular.isDefined(value)) {
				  if (value === 'false') {
				    enabled = false;
				  } else {
				    enabled = true;
				  }
			  }
			});

            element.on('mousewheel', function (event) {
              if (enabled) {
                  event.preventDefault();
                var viewBoxValues = attrs.viewbox.split(' ').map(function(value) {
                  return parseInt(value, 10);
                }),
					initialPoint = element[0].createSVGPoint(),
					afterZoomPoint;
				
				// Transform clicked point into SVG coordinate
				initialPoint = utilities.translateCoordinatesScreenToSVG(element, event.clientX, event.clientY);

                // Manipulate viewbox based on zoom in/out
                if (event.wheelDelta < 0) {
                    viewBoxValues[2] *= zoomRate;
                    viewBoxValues[3] *= zoomRate;
                } else if (event.wheelDelta > 0) {
                    viewBoxValues[2] /= zoomRate;
                    viewBoxValues[3] /= zoomRate;
                }

                // Apply new viewbox
                attrs.$set('viewbox', viewBoxValues.join(' '));

                // This centers the zoom on the mouse for a nicer effect
                // New position of mouse on svg document
				afterZoomPoint = utilities.translateCoordinatesScreenToSVG(element, event.clientX, event.clientY);

                // Determine change in location and offset viewbox by that
                viewBoxValues[0] += parseInt(initialPoint.x - afterZoomPoint.x, 10);
				viewBoxValues[1] += parseInt(initialPoint.y - afterZoomPoint.y, 10);

                // Apply new viewbox pan values
				attrs.$set('viewbox', viewBoxValues.join(' '));

                return false;
              }
            });
			}
		};
    }]);