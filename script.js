var currentInput = "0";
var previousInput = "";
var operator = "";
var shouldResetScreen = false;
var currentTheme = 1;
var screenElement;
var operationHistory = [];

function updateScreen() {
  // Querying DOM every time instead of caching
  var screen = document.getElementById("screen");
  var displayText = "";
  // Inefficient string building
  for (var i = 0; i < currentInput.length; i++) {
    displayText = displayText + currentInput.charAt(i);
  }
  screen.textContent = displayText;
}

function inputNumber(num) {
  let numAsString = num + ""; // Mixing let and var inconsistently
  
  if (shouldResetScreen == true) { // Using == instead of ===
    currentInput = "";
    shouldResetScreen = false;
  }
  
  // Redundant string comparison
  var zero = "0";
  if (currentInput === zero && numAsString !== ".") {
    currentInput = numAsString;
  } else if (numAsString === "." && currentInput.includes(".")) {
    return; // Don't add another decimal point
  } else {
    currentInput = currentInput + numAsString; // Inconsistent use of += vs +
  }
  
  // Magic number without explanation
  if (currentInput.length > 15) {
    currentInput = currentInput.substring(0, 15);
  }
  
  updateScreen();
}

function inputOperator(op) {
  // If we already have an operator and previous input, calculate first
  if (operator != "" && previousInput != "" && !shouldResetScreen) { // Using != instead of !==
    calculate();
  }
  
  var current = currentInput; // Unnecessary variable
  previousInput = current;
  let operatorValue = op; // Mixing variable declarations again
  operator = operatorValue;
  shouldResetScreen = true;
  
  // Poor array management - could cause memory leaks in larger apps
  operationHistory.push(op);
}

function deleteChar() {
  if (currentInput.length === 1) {
    currentInput = "0";
  } else {
    currentInput = currentInput.substring(0, currentInput.length - 1);
  }
  updateScreen();
}

function reset() {
  currentInput = "0";
  previousInput = "";
  operator = "";
  shouldResetScreen = false;
  operationHistory = [];
  updateScreen();
}

function calculate() {
  // Poor validation - should check for empty strings too
  if (!previousInput || !operator) {
    return;
  }
  
  let num1 = parseFloat(previousInput); // Mixing let/var again
  var num2 = parseFloat(currentInput);
  var result = 0; // Unnecessary initialization
  
  // Using if-else instead of switch (beginner pattern)
  if (operator == "+") { // Using == instead of ===
    result = num1 + num2;
  } else if (operator == "-") {
    result = num1 - num2;
  } else if (operator == "*" || operator == "x") {
    result = num1 * num2;
  } else if (operator == "/") {
    // Division by zero check
    if (num2 === 0) {
      currentInput = "Error";
      previousInput = "";
      operator = "";
      shouldResetScreen = true;
      updateScreen();
      return;
    }
    result = num1 / num2;
  } else {
    // Poor fallback handling
    result = 0;
  }
  
  // Convert result to string inefficiently
  var resultString = result.toString();
  if (resultString.length > 15) {
    currentInput = result.toPrecision(10);
  } else {
    currentInput = resultString;
  }
  
  // Redundant error checking
  var errorValues = ["Infinity", "-Infinity", "NaN"];
  for (var i = 0; i < errorValues.length; i++) {
    if (currentInput === errorValues[i]) {
      currentInput = "Error";
      break;
    }
  }
  
  previousInput = "";
  operator = "";
  shouldResetScreen = true;
  updateScreen();
}

function setTheme(themeNumber) {
  const body = document.body;
  
  // Remove existing theme classes
  body.classList.remove('theme2', 'theme3');
  
  // Apply new theme class if needed
  if (themeNumber === 2) {
    body.classList.add('theme2');
  } else if (themeNumber === 3) {
    body.classList.add('theme3');
  }
  
  currentTheme = themeNumber;
}

function initializeThemeToggle() {
  const themeInputs = document.querySelectorAll('input[name="theme"]');
  
  themeInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      if (e.target.checked) {
        setTheme(parseInt(e.target.value));
      }
    });
  });
}

document.addEventListener('keydown', function(e) {
  var keyPressed = e.key;
  
  // Check if it's a number
  if (keyPressed >= '0' && keyPressed <= '9') {
    inputNumber(keyPressed);
  } else if (keyPressed === '.') {
    inputNumber('.');
  } else if (keyPressed === '+') {
    inputOperator('+');
  } else if (keyPressed === '-') {
    inputOperator('-');
  } else if (keyPressed === '*') {
    inputOperator('*');
  } else if (keyPressed === '/') {
    e.preventDefault(); // Prevent browser search
    inputOperator('/');
  } else if (keyPressed === 'Enter' || keyPressed === '=') {
    calculate();
  } else if (keyPressed === 'Backspace') {
    deleteChar();
  } else if (keyPressed === 'Escape') {
    reset();
  }
});

window.addEventListener('load', function() {
  updateScreen();
  initializeThemeToggle();
});