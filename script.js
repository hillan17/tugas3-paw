
$(document).ready(function() {
  let currentInput = "0";
  let previousInput = "";
  let operation = null;
  let resetDisplay = false;

  const $mainDisplay = $("#main-display");
  const $historyDisplay = $("#history-display");

  // Update tampilan layar kalkulator
  function updateDisplay() {
    $mainDisplay.text(currentInput);
    if (operation && previousInput !== "") {
      const opSymbol = operation === '*' ? '×' : operation === '/' ? '÷' : operation;
      $historyDisplay.text(`${previousInput} ${opSymbol}`);
    } else {
      $historyDisplay.text("");
    }
  }

  // Event handler angka (0-9)
  $(".btn-num").on("click", function() {
    const num = $(this).data("num").toString();
    if (currentInput === "0" || resetDisplay) {
      currentInput = num;
      resetDisplay = false;
    } else {
      if (currentInput.replace(".", "").length < 12) {
        currentInput += num;
      }
    }
    updateDisplay();
  });

  // Event handler tombol titik desimal (.)
  $('[data-action="decimal"]').on("click", function() {
    if (resetDisplay) {
      currentInput = "0.";
      resetDisplay = false;
    } else if (!currentInput.includes(".")) {
      currentInput += ".";
    }
    updateDisplay();
  });

  // Event handler operator matematika (+, -, *, /)
  $(".btn-op").on("click", function() {
    const nextOp = $(this).data("op");

    if (operation !== null && !resetDisplay) {
      calculate();
    }

    previousInput = currentInput;
    operation = nextOp;
    resetDisplay = true;
    updateDisplay();
  });

  // Event handler persentase (%)
  $('[data-action="percent"]').on("click", function() {
    let val = parseFloat(currentInput);
    if (!isNaN(val)) {
      val = val / 100;
      currentInput = val.toString();
      updateDisplay();
    }
  });

  // Event handler hitung hasil (=)
  $('[data-action="calculate"]').on("click", function() {
    if (operation === null || resetDisplay) return;
    calculate();
    operation = null;
    previousInput = "";
    resetDisplay = true;
    updateDisplay();
  });

  // Event handler Reset (C)
  $('[data-action="clear"]').on("click", function() {
    currentInput = "0";
    previousInput = "";
    operation = null;
    resetDisplay = false;
    updateDisplay();
  });

  // Event handler Hapus (Backspace ⌫)
  $('[data-action="backspace"]').on("click", function() {
    if (resetDisplay) return;
    if (currentInput.length > 1) {
      currentInput = currentInput.slice(0, -1);
    } else {
      currentInput = "0";
    }
    updateDisplay();
  });

  // Fungsi perhitungan kalkulasi
  function calculate() {
    let result;
    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(curr)) return;

    switch (operation) {
      case "+":
        result = prev + curr;
        break;
      case "-":
        result = prev - curr;
        break;
      case "*":
        result = prev * curr;
        break;
      case "/":
        if (curr === 0) {
          alert("Tidak dapat membagi dengan nol!");
          return;
        }
        result = prev / curr;
        break;
      default:
        return;
    }

    // Hindari presisi float JS yang berlebihan
    result = Math.round(result * 1e8) / 1e8;
    currentInput = result.toString();
  }
});