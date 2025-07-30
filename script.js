var currentInput = "0";
var previousInput = "";
var operator = "";
var shouldResetScreen = false;
var currentTheme = 1;

function updateScreen() {
  document.getElementById("screen").textContent = currentInput;
}

function inputNumber(num) {
  if (shouldResetScreen) {
    currentInput = "";
    shouldResetScreen = false;
  }
  
  if (currentInput === "0" && num !== ".") {
    currentInput = num;
  } else if (num === "." && currentInput.includes(".")) {
    return;
  } else {
    currentInput += num;
  }
  
  if (currentInput.length > 15) {
    currentInput = currentInput.substring(0, 15);
  }
  
  updateScreen();
}

function inputOperator(op) {
  if (previousInput && operator && !shouldResetScreen) {
    calculate();
  }
  
  previousInput = currentInput;
  operator = op;
  shouldResetScreen = true;
}

function deleteChar() {
  if (currentInput.length === 1) {
    currentInput = "0";
  } else {
    currentInput = currentInput.slice(0, -1);
  }
  updateScreen();
}

function reset() {
  currentInput = "0";
  previousInput = "";
  operator = "";
  shouldResetScreen = false;
  updateScreen();
}

function calculate() {
  if (!previousInput || !operator) return;
  
  let expression = previousInput + operator + currentInput;
  
  expression = expression.replace(/x/g, '*');
  
  try {
    let result = eval(expression);
    
    if (result.toString().length > 15) {
      currentInput = result.toPrecision(10);
    } else {
      currentInput = result.toString();
    }
    
    if (currentInput === "Infinity" || currentInput === "-Infinity") {
      currentInput = "Error";
    }
    
    if (currentInput === "NaN") {
      currentInput = "Error";
    }
    
  } catch (e) {
    currentInput = "Error";
  }
  
  previousInput = "";
  operator = "";
  shouldResetScreen = true;
  updateScreen();
}

function setTheme(theme) {
  var body = document.body;
  var toggleButtons = document.querySelectorAll('.toggle-btn');
  
  body.classList.remove('theme2', 'theme3');
  
  toggleButtons.forEach(function(btn) {
    btn.classList.remove('active');
  });
  
  toggleButtons[theme - 1].classList.add('active');
  
  if (theme === 2) {
    body.classList.add('theme2');
  } else if (theme === 3) {
    body.classList.add('theme3');
  }
  
  currentTheme = theme;
  
}

document.addEventListener('keydown', function(e) {
  if (e.key >= '0' && e.key <= '9') {
    inputNumber(e.key);
  } else if (e.key === '.') {
    inputNumber('.');
  } else if (e.key === '+') {
    inputOperator('+');
  } else if (e.key === '-') {
    inputOperator('-');
  } else if (e.key === '*') {
    inputOperator('*');
  } else if (e.key === '/') {
    e.preventDefault();
    inputOperator('/');
  } else if (e.key === 'Enter' || e.key === '=') {
    calculate();
  } else if (e.key === 'Backspace') {
    deleteChar();
  } else if (e.key === 'Escape') {
    reset();
  }
});

window.addEventListener('load', function() {
  updateScreen();
});