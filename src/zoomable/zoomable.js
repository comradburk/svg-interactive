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