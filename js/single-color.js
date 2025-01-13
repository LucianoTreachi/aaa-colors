//*** VALORES FIJOS ***//

const DEFAULT_BG_COLOR = "#E0E0E0";
const DEFAULT_TEXT_COLOR = "#26182C";
const DEFAULT_CONTRAST_NUMBER = 12.73;
const GREEN_COLOR = "#138f42";
const RED_COLOR = "#d92d20";

//*** ELEMENTOS DEL DOM ***//

// Controles interactivos de la interfaz
const logoLink = document.querySelector(".logo-link");
const accessibilitySelectionButtons = document.querySelectorAll(".selection-button");
const generateButton = document.querySelector(".generate-button");
const resetButton = document.querySelector(".reset-button");
const closeDialogButton = document.querySelector(".close-dialog-button");
const backToTopButton = document.querySelector(".back-to-top-button");

// Ejemplo para colorear
const exampleCard = document.querySelector(".example-card");
const exampleTitle = document.querySelector(".example-title");
const exampleParagraph = document.querySelector(".example-paragraph");
const exampleButton = document.querySelector(".example-button");

// Información sobre los colores obtenidos
const contrastInfoNumber = document.querySelector(".contrast-info-number");
const aaaLevelIcon = document.querySelector(".aaa-level-icon");
const sampleColor1 = document.querySelector(".sample-color-1");
const sampleColor2 = document.querySelector(".sample-color-2");

const selectedHexCode = document.querySelector(".selected-hex-code");
const selectedRgbCode = document.querySelector(".selected-rgb-code");
const selectedHslCode = document.querySelector(".selected-hsl-code");

const randomHexCode = document.querySelector(".random-hex-code");
const randomRgbCode = document.querySelector(".random-rgb-code");
const randomHslCode = document.querySelector(".random-hsl-code");

// Modal
const dialogModal = document.querySelector(".dialog-modal");

//*** FUNCIONES UTILITARIAS ***//

// Función para cambiar aria-checked en cada botón de selección de nivel de accesibilidad
function updateAriaChecked(selectedCard = null) {
  accessibilitySelectionButtons.forEach(card => {
    card.setAttribute('aria-checked', card === selectedCard ? 'true' : 'false');
  });
}

// Función para convertir HEX a RGB
function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

// Función para convertir HEX a RGB en formato legible
function hexToRgbString(hex) {
  const rgb = hexToRgb(hex);
  return `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;
}

// Función para convertir HEX a RGBA en formato legible
function hexToRgba(hex, alpha = 1) {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

// Función para convertir HEX a HSL en formato legible
function hexToHsl(hex) {
  const rgb = hexToRgb(hex);
  let r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);

  return `${h}, ${s}%, ${l}%`;
}

// Función para calcular la relación de contraste según las luminancias de ambos colores
function getContrastRatio(color1, color2) {
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);
  const brightest = Math.max(luminance1, luminance2);
  const darkest = Math.min(luminance1, luminance2);

  return (brightest + 0.05) / (darkest + 0.05);
}

// Función para obtener las luminancias
function getLuminance(hex) {
  const rgb = hexToRgb(hex);

  const a = rgb.map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Función para obtener un color de contraste aleatorio en formato hexadecimal
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

// Función para encontrar un color de contraste adecuado
function findContrastColor(selectedColor, targetRatio) {
  let bestContrastColor = '#ffffff';
  let maxAttempts = 1000;

  while (maxAttempts > 0) {
    const randomColor = getRandomColor();
    const contrastRatio = getContrastRatio(selectedColor, randomColor);

    if (contrastRatio >= targetRatio) {
      bestContrastColor = randomColor;
      break;
    }

    maxAttempts--;
  }

  return bestContrastColor;
}

//*** FUNCIONES DE LA INTERFAZ ***//

// Función para generar y actualizar colores
function generateColors() {
  // Obtiene el color seleccionado por el usuario
  const selectedColor = document.querySelector(".color-input").value;

  // Obtiene el nivel de accesibilidad seleccionado por el usuario
  const level = document.querySelector('.selection-button[aria-checked="true"]').getAttribute('data-value');

  // Define los valores de relación de contraste según el nivel de accesibilidad
  const contrastRatios = {
    AA: { normal: 4.5, large: 3 },
    AAA: { normal: 7, large: 4.5 }
  };

  const contrastLevel = contrastRatios[level];

  // Encuentra el color de contraste que cumpla con el nivel de accesibilidad
  const contrastColor = findContrastColor(selectedColor, contrastLevel.normal);

  // Calcula la relación de contraste entre los colores
  const contrastRatio = getContrastRatio(selectedColor, contrastColor).toFixed(2);

  // Verifica si se ha seleccionado el nivel AA y la relación de contraste es menor a 7
  if (level === "AA" && contrastRatio < 7) {
    aaaLevelIcon.style.fill = RED_COLOR;
  } else {
    aaaLevelIcon.style.fill = GREEN_COLOR;
  }

  // Verifica si se ha seleccionado el nivel AAA y aún así no se puede alcanzar una relación de contraste mayor a 7
  if (level === "AAA" && contrastRatio < contrastLevel.normal) {
    // Si no se puede cumplir, muestra un modal con una advertencia
    dialogModal.showModal();
    return;
  }

  // Muestra un mensaje informativo sobre la relación de contraste
  contrastInfoNumber.textContent = contrastRatio;

  // Actualiza el ejemplo con los colores seleccionados
  updateExampleColors(selectedColor, contrastColor);

  // Actualiza los colores de las muestras
  updateColorsInformation(selectedColor, contrastColor);
}

// Función para actualizar los colores en el ejemplo
function updateExampleColors(selectedColor, contrastColor) {
  // Aplica el color seleccionado al fondo de la tarjeta
  exampleCard.style.backgroundColor = selectedColor;

  // Aplica el color de contraste al título de la tarjeta
  exampleTitle.style.color = contrastColor;

  // Aplica el color de contraste al párrafo de la tarjeta 
  exampleParagraph.style.color = contrastColor;

  // Aplica el color de contraste y el color seleccionado al botón de la tarjeta
  exampleButton.style.backgroundColor = contrastColor;
  exampleButton.style.color = selectedColor;
}

// Función para actualizar la información de colores
function updateColorsInformation(selectedColor, contrastColor) {
  // Actualiza las muestras de colores
  sampleColor1.style.backgroundColor = selectedColor;
  sampleColor2.style.backgroundColor = contrastColor;

  // Actualiza el código hexadecimal
  selectedHexCode.textContent = selectedColor;
  randomHexCode.textContent = contrastColor;

  // Actualiza el código RGB
  const selectedRgb = hexToRgbString(contrastColor);
  const contrastRgb = hexToRgbString(selectedColor);
  selectedRgbCode.textContent = selectedRgb;
  randomRgbCode.textContent = contrastRgb;

  // Actualiza el código HSL
  const selectedHsl = hexToHsl(contrastColor);
  const contrastHsl = hexToHsl(selectedColor);
  selectedHslCode.textContent = selectedHsl;
  randomHslCode.textContent = contrastHsl;
}

// Función para restablecer todos los valores
function reset() {
  // Restablece el color del input
  document.querySelector(".color-input").value = DEFAULT_BG_COLOR;

  // Restablece el nivel de accesibilidad a: AA
  const aaButton = document.querySelector('.selection-button[data-value="AA"]');
  updateAriaChecked(aaButton);

  // Restablece la información de relación de contraste
  contrastInfoNumber.textContent = DEFAULT_CONTRAST_NUMBER;

  // Restablece los colores del ejemplo
  updateExampleColors(DEFAULT_BG_COLOR, DEFAULT_TEXT_COLOR);

  // Restablece la información de colores
  updateColorsInformation(DEFAULT_BG_COLOR, DEFAULT_TEXT_COLOR);

  // Restablece el color del ícono AAA
  aaaLevelIcon.style.fill = GREEN_COLOR;
}

//*** FUNCIONES DE NAVEGACIÓN ***//

// Función para navegar hacia la sección de ejemplo
function navigateToExampleSection() {
  document.getElementById("example-section").scrollIntoView({ behavior: "smooth" });
}

// Función para navegar hacia arriba y enfocar el logo
function backToTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });

  setTimeout(() => {
    logoLink.focus();
  }, 1000);
}

//*** BOTONES DE LA INTERFAZ ***//

// Botones de selección de accesibilidad
accessibilitySelectionButtons.forEach(card => {
  card.addEventListener('click', () => {
    const radio = document.querySelector(`#${card.dataset.for}`);
    if (radio) radio.checked = true;
    updateAriaChecked(card);
  });

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const radio = document.querySelector(`#${card.dataset.for}`);
      if (radio) radio.checked = true;
      updateAriaChecked(card);
    }
  });
});

// Botón principal 'Generar'
generateButton.addEventListener("click", () => {
  generateColors();
  // Verifica si el modal está abierto antes de navegar
  if (!dialogModal.open) {
    navigateToExampleSection();
  }
})

// Botón 'Restablecer valores'
resetButton.addEventListener("click", reset);

// Botón del ejemplo
exampleButton.addEventListener("click", generateColors);

// Botón Cerrar diálogo
closeDialogButton.addEventListener("click", () => {
  dialogModal.close();
})

// Botón para navegar hacia arriba
backToTopButton.addEventListener("click", backToTop);