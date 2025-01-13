//*** VALORES FIJOS ***//

const DEFAULT_PRIMARY_COLOR = "#E0E0E0";
const DEFAULT_SECONDARY_COLOR = "#26182C";
const DEFAULT_ACCENT_COLOR = "#0a3b85";
const GREEN_COLOR = "#138f42";
const RED_COLOR = "#d92d20";

//*** ELEMENTOS DEL DOM ***//

// Controles interactivos de la interfaz
const logoLink = document.querySelector(".logo");
const accessibilitySelectionButtons = document.querySelectorAll(".selection-button");
const generateButton = document.querySelector(".generate-button");
const resetButton = document.querySelector(".reset-button");
const backToTopButton = document.querySelector(".back-to-top-button");

// Ejemplo para colorear
const exampleCard = document.querySelector(".example-card");
const exampleTitle = document.querySelector(".example-title");
const exampleParagraph = document.querySelector(".example-paragraph");
const exampleButton = document.querySelector(".example-button");

// Información sobre los colores obtenidos
const contrastPrimarySecondaryInfo = document.querySelector(".contrast-primary-secondary-info");
const contrastPrimaryAccentInfo = document.querySelector(".contrast-primary-accent-info");
const aaaLevelIcon = document.querySelector(".aaa-level-icon");
const sampleColor1 = document.querySelector(".sample-color-1");
const sampleColor2 = document.querySelector(".sample-color-2");
const sampleColor3 = document.querySelector(".sample-color-3");

const primaryHexCode = document.querySelector(".primary-hex-code");
const primaryRgbCode = document.querySelector(".primary-rgb-code");
const primaryHslCode = document.querySelector(".primary-hsl-code");

const secondaryHexCode = document.querySelector(".secondary-hex-code");
const secondaryRgbCode = document.querySelector(".secondary-rgb-code");
const secondaryHslCode = document.querySelector(".secondary-hsl-code");

const accentHexCode = document.querySelector(".accent-hex-code");
const accentRgbCode = document.querySelector(".accent-rgb-code");
const accentHslCode = document.querySelector(".accent-hsl-code");

// Establecer el nivel de accesibilidad seleccionado por defecto
let selectedLevel = 'AA';


//*** FUNCIONES AUXILIARES ***//

// Función para calcular el contraste entre dos colores usando la fórmula WCAG 2.0
function calculateContrast(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const luminance1 = getLuminance(rgb1);
  const luminance2 = getLuminance(rgb2);

  const contrastRatio = (Math.max(luminance1, luminance2) + 0.05) / (Math.min(luminance1, luminance2) + 0.05);

  return contrastRatio;
}

// Función para convertir HEX a RGB
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

// Función para convertir RGB a HSL
function rgbToHsl({ r, g, b }) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // Achromatic
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

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// Función para calcular la luminancia de un color RGB
function getLuminance(rgb) {
  const a = [rgb.r, rgb.g, rgb.b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Función para generar un color aleatorio en formato HEX
function generateRandomColor() {
  const randomHex = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  return `#${randomHex}`;
}

// Función para manejar la selección de los niveles de accesibilidad
function handleSelection(button) {
  selectedLevel = button.getAttribute('data-value');
  accessibilitySelectionButtons.forEach(btn => btn.setAttribute('aria-checked', 'false'));
  button.setAttribute('aria-checked', 'true');
}

//*** FUNCIONES DE LA INTERFAZ ***//

// Función para actualizar los colores del ejemplo
function updateExampleColors(primary, secondary, accent) {
  // Convierte el color de texto a RGB para usarlo luego como RGBA
  const { r, g, b } = hexToRgb(secondary);

  // Aplica el color seleccionado al fondo de la tarjeta
  exampleCard.style.backgroundColor = primary;

  // Aplica el color de contraste al título de la tarjeta
  exampleTitle.style.color = secondary;

  // Aplica el color de contraste al párrafo de la tarjeta
  exampleParagraph.style.color = secondary;
  // exampleParagraph.style.color = `rgba(${r}, ${g}, ${b}, 0.85)`;

  // Aplica el color de contraste y el color seleccionado al botón de la tarjeta
  exampleButton.style.backgroundColor = accent;
  exampleButton.style.color = primary;
}

// Función para actualizar la información de colores
function updateColorsInformation(primaryColor, secondaryColor, accentColor, selectedLevel) {
  // Calcula los contrastes entre los colores
  const contrastPrimarySecondary = calculateContrast(primaryColor, secondaryColor);
  const contrastPrimaryAccent = calculateContrast(primaryColor, accentColor);

  // Actualiza las relaciones de contraste
  contrastPrimarySecondaryInfo.textContent = contrastPrimarySecondary.toFixed(2);
  contrastPrimaryAccentInfo.textContent = contrastPrimaryAccent.toFixed(2);

  // Actualiza el color del ícono AAA basado en los contrastes
  if (
    (selectedLevel === "AA" && (contrastPrimarySecondary < 7 || contrastPrimaryAccent < 7))
  ) {
    aaaLevelIcon.style.fill = RED_COLOR;
  } else {
    aaaLevelIcon.style.fill = GREEN_COLOR;
  }

  // Convierte los colores a RGB
  const primaryRgb = hexToRgb(primaryColor);
  const secondaryRgb = hexToRgb(secondaryColor);
  const accentRgb = hexToRgb(accentColor);

  // Convierte los colores a HSL
  const primaryHsl = rgbToHsl(primaryRgb);
  const secondaryHsl = rgbToHsl(secondaryRgb);
  const accentHsl = rgbToHsl(accentRgb);

  // Actualiza las muestras de color
  sampleColor1.style.backgroundColor = primaryColor;
  sampleColor2.style.backgroundColor = secondaryColor;
  sampleColor3.style.backgroundColor = accentColor;

  // Actualiza los códigos de color para el color primario
  primaryHexCode.textContent = primaryColor;
  primaryRgbCode.textContent = `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`;
  primaryHslCode.textContent = `${primaryHsl.h}, ${primaryHsl.s}%, ${primaryHsl.l}%`;

  // Actualiza los códigos de color para el color secundario
  secondaryHexCode.textContent = secondaryColor;
  secondaryRgbCode.textContent = `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`;
  secondaryHslCode.textContent = `${secondaryHsl.h}, ${secondaryHsl.s}%, ${secondaryHsl.l}%`;

  // Actualiza los códigos de color para el color acento
  accentHexCode.textContent = accentColor;
  accentRgbCode.textContent = `${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}`;
  accentHslCode.textContent = `${accentHsl.h}, ${accentHsl.s}%, ${accentHsl.l}%`;
}

// Función para generar colores siguiendo la regla 60-30-10
function generateColors(selectedLevel) {
  let primaryColor, secondaryColor, accentColor;
  let contrastPrimarySecondary, contrastPrimaryAccent;

  do {
    // Genera colores aleatorios
    primaryColor = generateRandomColor();
    secondaryColor = generateRandomColor();
    accentColor = generateRandomColor();

    // Calcula contrastes
    contrastPrimarySecondary = calculateContrast(primaryColor, secondaryColor);
    contrastPrimaryAccent = calculateContrast(primaryColor, accentColor);

    // Valida contrastes según nivel de accesibilidad
  } while (
    (selectedLevel === 'AA' && (contrastPrimarySecondary < 4.5 || contrastPrimaryAccent < 4.5)) ||
    (selectedLevel === 'AAA' && (contrastPrimarySecondary < 7 || contrastPrimaryAccent < 7))
  );

  // Actualiza los colores en el ejemplo
  updateExampleColors(primaryColor, secondaryColor, accentColor);

  // Actualiza la información de los colores
  updateColorsInformation(primaryColor, secondaryColor, accentColor, selectedLevel);
}

// Función para restablecer todos los valores
function reset() {
  // Restaura los colores de los ejemplos
  updateExampleColors(DEFAULT_PRIMARY_COLOR, DEFAULT_SECONDARY_COLOR, DEFAULT_ACCENT_COLOR);

  // Restaura la sección de información de colores
  updateColorsInformation(DEFAULT_PRIMARY_COLOR, DEFAULT_SECONDARY_COLOR, DEFAULT_ACCENT_COLOR, "AA");

  // Restaura al nivel AA en los botones de selección de accesibilidad
  selectedLevel = "AA";
  accessibilitySelectionButtons.forEach(button => {
    if (button.getAttribute('data-value') === "AA") {
      button.setAttribute('aria-checked', 'true');
    } else {
      button.setAttribute('aria-checked', 'false');
    }
  });
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
accessibilitySelectionButtons.forEach(button => {
  // Evento de clic
  button.addEventListener('click', () => {
    handleSelection(button);
  });

  // Evento de teclado (Enter o Espacio)
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelection(button);
    }
  });
});

// Botón principal 'Generar'
generateButton.addEventListener('click', () => {
  navigateToExampleSection();
  generateColors(selectedLevel);
});

// Botón del ejemplo
exampleButton.addEventListener("click", () => {
  generateColors(selectedLevel);
})

// Botón 'Restablecer valores'
resetButton.addEventListener('click', reset);

// Botón para navegar hacia arriba
backToTopButton.addEventListener("click", backToTop);