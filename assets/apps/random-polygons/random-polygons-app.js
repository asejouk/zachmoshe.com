'use strict';

var BOUNDARY_VERTICAL = "V";
var BOUNDARY_HORIZONTAL = "H";

var Boundary = function(type, row, col) { 
	if (type !== BOUNDARY_HORIZONTAL && type !== BOUNDARY_VERTICAL) { 
		throw "Illegal type " + type + " four Boundary";
	}
	this.type = type;
	this.row = row;
	this.col = col;
};


var Grid = function(n) { 

	var initialize_boundaries = function(N) { 
		// initialize all boundaries
		var boundaries = {};
		boundaries[BOUNDARY_VERTICAL] = {};
		boundaries[BOUNDARY_HORIZONTAL] = {};
		// vertical ones
		for (var row=0 ; row<N ; row++) { 
			boundaries[BOUNDARY_VERTICAL][row] = {};

			for (var col=0 ; col<N-1 ; col++) {
				boundaries[BOUNDARY_VERTICAL][row][col] = 1;
			}
		}
		// horizontal ones
		for (var row=0 ; row<N-1 ; row++) { 
			boundaries[BOUNDARY_HORIZONTAL][row] = {};

			for (var col=0 ; col<N ; col++) { 
				boundaries[BOUNDARY_HORIZONTAL][row][col] = 1;
			}
		}
		return boundaries;
	}

	// setup the object properties
	this.N = n;
	this.boundaries = initialize_boundaries(this.N);

	// some methods
	this.apply_boundary_pct = function(pct) { 
		for (var row=0 ; row<this.N ; row++) { 
			for (var col=0 ; col<this.N-1 ; col++) {
				this.boundaries[BOUNDARY_VERTICAL][row][col] = (Math.random()<pct) ? 1 : 0;
			}
		}
		// horizontal ones
		for (var row=0 ; row<this.N-1 ; row++) { 
			for (var col=0 ; col<this.N ; col++) { 
				this.boundaries[BOUNDARY_HORIZONTAL][row][col] = (Math.random()<pct) ? 1 : 0
			}
		}

	}


};


/**
 * @ngdoc overview
 * @name randomPolygonsApp
 * @description
 * # randomPolygonsApp
 *
 * Main module of the application.
 */
var app = angular.module('randomPolygonsApp', []);

app	.controller('polygonsCtrl', ['$scope', function($scope) { 
	$scope.grid_size = 50;
	$scope.grid_pct = 0.75;

	$scope.estAvgBlockSize = function(n,p) { 
		n = parseFloat(n)
		p = parseFloat(p)
		if (p===0) { 
			return n*n;
		}
    		return Math.pow( ( Math.pow(1-p,n)*(n*p-p+2)+p-2 ) / p, 2)
	};

	$scope.getBlockExampleId = function(avg_block_size) { 
		if (avg_block_size < 1.5) { 
			return 0;
		} else if (avg_block_size < 2.5) { 
			return 1;
		} else if (avg_block_size < 3.5) { 
			return 2;
		} else if (avg_block_size < 5) { 
			return 3;
		} else if (avg_block_size < 8) { 
			return 4;
		} else if (avg_block_size < 15) { 
			return 5;
		} else if (avg_block_size < 35) { 
			return 6;
		} else { 
			return 7;
		}
	};

}]);



app.directive('polygonsCanvas', function () {
    return {
      template: '',
      restrict: 'A',

      link: function postLink($scope, $element, $attrs) {
        // setup
        $element.attr('height', '1000');
        $element.attr('width', '1000');

        // generate the first grid
        $scope.reset($scope.grid_size, $scope.grid_pct);
      },
      
      controller: [ '$scope', '$element', function($scope, $element) { 

        var canvas = $element[0]
        var context = canvas.getContext('2d');

        $scope.reset = function(n, pct) { 
          this.N = n;
          this.grid = new Grid(n);
          this.grid.apply_boundary_pct(pct);


          var width = canvas.width;
          var height = canvas.height;
          var cellHeight = height / this.grid.N;
          var cellWidth = width / this.grid.N;


          // clear canvas
          context.clearRect(0,0, width, height);

          // draw the border
          context.beginPath();
          context.lineWidth=2;
          context.rect(0,0,width, height);
          context.stroke();


          // draw all boundaries
          context.lineWidth = 1;
          for (var row in Object.keys(this.grid.boundaries["V"])) { 
            for (var col in Object.keys(this.grid.boundaries["V"][row])) { 
              row = parseInt(row)
              col = parseInt(col)
              
              context.beginPath();
              context.strokeStyle = (this.grid.boundaries["V"][row][col] === 1)  ? "black" : "white";
              context.moveTo(cellWidth*(col+1), cellHeight*row);
              context.lineTo(cellWidth*(col+1), cellHeight*(row+1));
              context.stroke();
            }
          }
          for (var row in Object.keys(this.grid.boundaries["H"])) { 
            for (var col in Object.keys(this.grid.boundaries["H"][row])) { 
              row = parseInt(row);
              col = parseInt(col);
              
              context.beginPath();
              context.strokeStyle = (this.grid.boundaries["H"][row][col] === 1)  ? "black" : "white";
              context.moveTo(cellWidth*col, cellHeight*(row+1));
              context.lineTo(cellWidth*(col+1), cellHeight*(row+1));
              context.stroke();
            }
          }
        };

      }]

    };
  });






