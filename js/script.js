// Begin game once DOM loaded
document.addEventListener("DOMContentLoaded", game);

function game() {

	// Data structure to hold positions of tiles
	var parentX = document.querySelector(".sliding-puzzle").clientHeight;
	var baseDistance = 25.2;
	var tileMap = {
		1: {
			tileNumber: 1,
			position: 1,
			top: 0,
			left: 0
		},
		2: {
			tileNumber: 2,
			position: 2,
			top: 0,
			left: baseDistance * 1
		},
		3: {
			tileNumber: 3,
			position: 3,
			top: 0,
			left: baseDistance * 2
		},
		4: {
			tileNumber: 4,
			position: 4,
			top: 0,
			left: baseDistance * 3
		},
		5: {
			tileNumber: 5,
			position: 5,
			top: baseDistance,
			left: 0
		},
		6: {
			tileNumber: 6,
			position: 6,
			top: baseDistance,
			left: baseDistance
		},
		7: {
			tileNumber: 7,
			position: 7,
			top: baseDistance,
			left: baseDistance * 2
		},
		8: {
			tileNumber: 8,
			position: 8,
			top: baseDistance,
			left: baseDistance * 3
		},
		9: {
			tileNumber: 9,
			position: 9,
			top: baseDistance * 2,
			left: 0
		},
		10: {
			tileNumber: 10,
			position: 10,
			top: baseDistance * 2,
			left: baseDistance
		},
		11: {
			tileNumber: 11,
			position: 11,
			top: baseDistance * 2,
			left: baseDistance * 2
		},
		12: {
			tileNumber: 12,
			position: 12,
			top: baseDistance * 2,
			left: baseDistance * 3
		},
		13: {
			tileNumber: 13,
			position: 13,
			top: baseDistance * 3,
			left: 0
		},
		14: {
			tileNumber: 14,
			position: 14,
			top: baseDistance * 3,
			left: baseDistance
		},
		15: {
			tileNumber: 15,
			position: 15,
			top: baseDistance * 3,
			left: baseDistance * 2
		},
		empty: {
			position: 16,
			top: baseDistance * 3,
			left: baseDistance * 3
		}
	}

	// Array of tileNumbers in order of last moved
	var history = [];

	// Movement map
	function movementMap(position) {
		if (position == 16) return [12, 15];
		if (position == 15) return [11, 14, 16];
		if (position == 14) return [10, 13, 15];
		if (position == 13) return [9, 14];
		if (position == 12) return [8, 11, 16];
		if (position == 11) return [7, 10, 12, 15];
		if (position == 10) return [6, 9, 11, 14];
		if (position == 9) return [5, 10, 13];
		if (position == 8) return [4, 7, 12];
		if (position == 7) return [3, 6, 8, 11];
		if (position == 6) return [2, 5, 7, 10];
		if (position == 5) return [1, 6, 9];
		if (position == 4) return [3, 8];
		if (position == 3) return [2, 4, 7];
		if (position == 2) return [1, 3, 6];
		if (position == 1) return [2, 5];
	}

	// Board setup according to the tileMap
	document.querySelector('#shuffle').addEventListener('click', shuffle, true);
	document.querySelector('#solve').addEventListener('click', solve, true);
	backgroundSelector();
	document.querySelector('#overlay').addEventListener('click', endCongratsOverLay, true);
	var tiles = document.querySelectorAll('.tile');
	var delay = -50;
	for (var i = 0; i < tiles.length; i++) {
		tiles[i].addEventListener('click', tileClicked, true);

		var tileId = tiles[i].innerHTML;
		delay += 50;
		setTimeout(setup, delay, tiles[i]);
	}

	function setup(tile) {
		var tileId = tile.innerHTML;
		// tile.style.left = tileMap[tileId].left + '%';
		// tile.style.top = tileMap[tileId].top + '%';
		var xMovement = parentX * (tileMap[tileId].left / 100);
		var yMovement = parentX * (tileMap[tileId].top / 100);
		var translateString = "translateX(" + xMovement + "px) " + "translateY(" + yMovement + "px)"
		tile.style.webkitTransform = translateString;
		tile.style.backgroundPosition = -xMovement + "px " + -yMovement + "px";
		tile.style.backgroundImage = 'url(https://i.ibb.co/vzFn7rL/3-650x650.jpg)';
		recolorTile(tile, tileId);
	}

	function backgroundSelector() {
		var select = document.getElementById("background");
		select.onchange = () => {
			var bg = document.getElementById("background").value;
			var tiles = document.querySelectorAll('.tile');
			for (var i = 0; i < tiles.length; i++) {
				tiles[i].style.backgroundImage = 'url(' + bg + ')';
			}
		};
	}

	function tileClicked(event) {
		var tileNumber = event.target.innerHTML;
		moveTile(event.target);

		if (checkSolution()) {
			console.log("You win!");
			startCongratsOverLay();
		}
	}

	// Moves tile to empty spot
	// Returns error message if tile cannot be moved
	function moveTile(tile, recordHistory = true) {
		// Check if Tile can be moved 
		// (must be touching empty tile)
		// (must be directly perpendicular to empty tile)
		var tileNumber = tile.innerHTML;
		if (!tileMovable(tileNumber)) {
			console.log("Tile " + tileNumber + " can't be moved.");
			return;
		}

		// Push to history
		if (recordHistory == true) {

			if (history.length >= 3) {
				if (history[history.length - 1] != history[history.length - 3]) history.push(tileNumber);
			} else {
				history.push(tileNumber);
			}
		}

		// Swap tile with empty tile
		var emptyTop = tileMap.empty.top;
		var emptyLeft = tileMap.empty.left;
		var emptyPosition = tileMap.empty.position;
		tileMap.empty.top = tileMap[tileNumber].top;
		tileMap.empty.left = tileMap[tileNumber].left;
		tileMap.empty.position = tileMap[tileNumber].position;

		// tile.style.top = emptyTop  + '%'; 
		// tile.style.left = emptyLeft  + '%';

		var xMovement = parentX * (emptyLeft / 100);
		var yMovement = parentX * (emptyTop / 100);
		var translateString = "translateX(" + xMovement + "px) " + "translateY(" + yMovement + "px)"
		tile.style.webkitTransform = translateString;

		tileMap[tileNumber].top = emptyTop;
		tileMap[tileNumber].left = emptyLeft;
		tileMap[tileNumber].position = emptyPosition;

		recolorTile(tile, tileNumber);
	}


	// Determines whether a given tile can be moved
	function tileMovable(tileNumber) {
		var selectedTile = tileMap[tileNumber];
		var emptyTile = tileMap.empty;
		var movableTiles = movementMap(emptyTile.position);

		if (movableTiles.includes(selectedTile.position)) {
			return true;
		} else {
			return false;
		}
	}

	// Returns true/false based on if the puzzle has been solved
	function checkSolution() {
		if (tileMap.empty.position !== 16) return false;

		for (var key in tileMap) {
			if ((key != 1) && (key != "empty")) {
				if (tileMap[key].position < tileMap[key - 1].position) return false;
			}
		}

		// Clear history if solved
		history = [];
		return true;
	}

	// Check if tile is in correct place!
	function recolorTile(tile, tileId) {
		if (tileId == tileMap[tileId].position) {
			tile.classList.remove("error");
		} else {
			tile.classList.add("error");
		}
	}


	// Shuffles the current tiles
	shuffleTimeouts = [];
	function shuffle() {
		clearTimers(solveTimeouts);
		var boardTiles = document.querySelectorAll('.tile');
		var shuffleDelay = 200;
		shuffleLoop();

		var shuffleCounter = 0;
		while (shuffleCounter < 20) {
			shuffleDelay += 200;
			shuffleTimeouts.push(setTimeout(shuffleLoop, shuffleDelay));
			shuffleCounter++;
		}
	}

	var lastShuffled;

	function shuffleLoop() {
		var emptyPosition = tileMap.empty.position;
		var shuffleTiles = movementMap(emptyPosition);
		var tilePosition = shuffleTiles[Math.floor(Math.floor(Math.random() * shuffleTiles.length))];
		var locatedTile;
		for (var i = 1; i <= 15; i++) {
			if (tileMap[i].position == tilePosition) {
				var locatedTileNumber = tileMap[i].tileNumber;
				locatedTile = tiles[locatedTileNumber - 1];
			}
		}
		if (lastShuffled != locatedTileNumber) {
			moveTile(locatedTile);
			lastShuffled = locatedTileNumber;
		} else {
			shuffleLoop();
		}

	}


	function clearTimers(timeoutArray) {
		for (var i = 0; i < timeoutArray.length; i++) {
			clearTimeout(timeoutArray[i])
		}
	}

	// Temporary function for solving puzzle.
	// To be reimplemented with a more sophisticated algorithm
	solveTimeouts = []
	function solve() {
		clearTimers(shuffleTimeouts);


		repeater = history.length;

		for (var i = 0; i < repeater; i++) {
			console.log("started");
			solveTimeouts.push(setTimeout(moveTile, i * 100, tiles[history.pop() - 1], false));
		}
	}

	// Open congrate overlay
	function startCongratsOverLay() {
		document.getElementById("overlay").style.display = "block";
	}

	// Close congrate overlay
	function endCongratsOverLay() {
		document.getElementById("overlay").style.display = "none";
	}
}