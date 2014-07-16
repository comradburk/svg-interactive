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
					
					event.stopPropagation();
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