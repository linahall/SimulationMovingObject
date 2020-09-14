const readline = require("readline");

const readlineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

let movingObject = {
  positionX: 0,
  positionY: 0,
  direction: "NORTH",
};
let table = {
  width: 0,
  height: 0,
};

// To write the question and read the answer from the console
function ask(questionText) {
  return new Promise((resolve, reject) => {
    readlineInterface.question(questionText, resolve);
  });
}

// Check that the format of the string only contains digits, commas and only four numbers
// The start position of the object should be in the table size.
function checkInputTableAndStartPosition(tableAndStartPosition) {
  if (tableAndStartPosition.match(/^([1-9]+,){2}[0-9]+,[0-9]+$/)) {
    // The input is saved in the global variables for the check of the objects position
    saveInputTableAndStartPosition(tableAndStartPosition);
    if (checkObjectOutsideTable()) {
      return false;
    }
    return true;
  } else {
    return false;
  }
}

// The table size and start position is saved
function saveInputTableAndStartPosition(tableAndStartPosition) {
  let chars = tableAndStartPosition.split(",");
  table.width = parseInt(chars[0]);
  table.height = parseInt(chars[1]);
  movingObject.positionX = parseInt(chars[2]);
  movingObject.positionY = parseInt(chars[3]);
}

// Check that the format of the string only contains digits 0-4 and commas
function checkInputMovingCommands(movingCommands) {
  if (movingCommands.match(/^([1-4],)+0$/)) {
    return true;
  } else {
    return false;
  }
}

// Write the position to the console
function endSimulation() {
  console.log(
    "\n[" + movingObject.positionX + ", " + movingObject.positionY + "]"
  );
  process.exit();
}

// 1 = move forward one step
function moveForward() {
  switch (movingObject.direction) {
    case "NORTH":
      movingObject.positionY--;
      break;
    case "EAST":
      movingObject.positionX++;
      break;
    case "SOUTH":
      movingObject.positionY++;
      break;
    case "WEST":
      movingObject.positionX--;
      break;
    default:
      break;
  }
}

// 2 = move backwards one step
function moveBack() {
  switch (movingObject.direction) {
    case "NORTH":
      movingObject.positionY++;
      break;
    case "EAST":
      movingObject.positionX--;
      break;
    case "SOUTH":
      movingObject.positionY--;
      break;
    case "WEST":
      movingObject.positionX++;
      break;
    default:
      break;
  }
}

// 3 = rotate clockwise 90 degrees
function rotateClockwise() {
  switch (movingObject.direction) {
    case "NORTH":
      movingObject.direction = "EAST";
      break;
    case "EAST":
      movingObject.direction = "SOUTH";
      break;
    case "SOUTH":
      movingObject.direction = "WEST";
      break;
    case "WEST":
      movingObject.direction = "NORTH";
      break;
    default:
      break;
  }
}

// 4 = rotate counterclockwise 90 degrees
function rotateCounterClockwise() {
  switch (movingObject.direction) {
    case "NORTH":
      movingObject.direction = "WEST";
      break;
    case "EAST":
      movingObject.direction = "NORTH";
      break;
    case "SOUTH":
      movingObject.direction = "EAST";
      break;
    case "WEST":
      movingObject.direction = "SOUTH";
      break;
    default:
      break;
  }
}

// Check to see if the objects position is outside the table
function checkObjectOutsideTable() {
  let outsideTable = false;
  if (movingObject.positionX < 0 || movingObject.positionX >= table.width) {
    outsideTable = true;
  } else if (
    movingObject.positionY < 0 ||
    movingObject.positionY >= table.height
  ) {
    outsideTable = true;
  }
  if (outsideTable) {
    movingObject.positionX = -1;
    movingObject.positionY = -1;
  }
  return outsideTable;
}

// Simulating the moving commands. For every step, a check is done if the
// object is outside the table and if so the simulation is ended
function simulateMovingCommands(movingCommands) {
  for (let i = 0; i < movingCommands.length; i++) {
    if (movingCommands[i] === ",") {
      continue;
    } else {
      switch (movingCommands[i]) {
        case "0":
          endSimulation();
          break;
        case "1":
          moveForward();
          checkObjectOutsideTable() ? endSimulation() : "";
          break;
        case "2":
          moveBack();
          checkObjectOutsideTable() ? endSimulation() : "";
          break;
        case "3":
          rotateClockwise();
          checkObjectOutsideTable() ? endSimulation() : "";
          break;
        case "4":
          rotateCounterClockwise();
          checkObjectOutsideTable() ? endSimulation() : "";
          break;
        default:
          break;
      }
    }
  }
}

start();

async function start() {
  let tableAndStartPosition = "";
  let movingCommands = "";
  // Ask for the table size and objects start position
  // Check that the format of the string is correct outerwise ask again
  do {
    tableAndStartPosition = await ask(
      "\nEnter the table size and the objects starting position (width,height,x,y): "
    );
  } while (!checkInputTableAndStartPosition(tableAndStartPosition));
  // Write the moving commands to the console
  console.log(
    "\nThe moving commands are:" +
      "\n 0 = Quit simulation and print results" +
      "\n 1 = Move forward one step" +
      "\n 2 = Move backwards one step" +
      "\n 3 = Rotate clockwise 90 degrees" +
      "\n 4 = Totate counterclockwise 90 degrees"
  );
  // Ask for the moving commands
  // Check that the format of the string is correct outerwise ask again
  do {
    movingCommands = await ask(
      "Enter the moving commands (separate with commas and no spaces): "
    );
  } while (!checkInputMovingCommands(movingCommands));
  // Simulate the moving of the object
  simulateMovingCommands(movingCommands);
}
