// Arreglo con sugerencias para el IMC
const sugerenciasIMC = [
      "Intente consumir más calorías y llevar una dieta balanceada.",
      "¡Siga manteniendo un estilo de vida saludable!",
      "Considere incorporar actividad física regular para controlar su peso.",
      "Es necesario que consulte con un profesional de la salud para un plan personalizado.",
]

// Función para calcular el IMC (Indice de Masa Corporal)
function calcularIMC() {
      const peso = parseFloat(prompt("Ingrese su peso en kilogramos:"));
      const altura = parseFloat(prompt("Ingrese su altura en metros. Ej: 1.751:"));

      // Validaciones por si el usuario ingresa valores incorrectos.
      if (isNaN(peso) || isNaN(altura) || altura <= 0 || peso <= 0) {
            alert("Por favor, ingrese valores válidos.");
            return;
      }

      // Formula para calcular el IMC.
      const IMC = peso / (altura * altura);

      // Variable para almacenar la clasificación del IMC.
      let clasificacion = "";

      let indiceSugerencia = 0;

      // Resultados posibles de acuerdo al IMC.
      if (IMC < 18.5) {
            clasificacion = "un peso por debajo del peso ideal";
            indiceSugerencia = 0;
      } else if (IMC >= 18.5 && IMC <= 24.9) {
            clasificacion = "un peso normal";
            indiceSugerencia = 1;
      } else if (IMC >= 25 && IMC <= 29.9) {
            clasificacion = "sobrepeso";
            indiceSugerencia = 2;
      } else {
            clasificacion = "obesidad";
            indiceSugerencia = 3;
      }

      alert(`Su IMC es de ${IMC.toFixed(2)}. Usted tiene ${clasificacion}. ${sugerenciasIMC[indiceSugerencia]}`);
}

// Función para calcular las calorias
function calcularCalorias() {
      let peso, altura, sexo, edad, actividad, objetivo;

      // Validacin del peso
      while (true) {
            peso = parseFloat(prompt("Ingrese su peso en kilogramos:"));
            if (!isNaN(peso) && peso > 0) break;
            alert("Por favor, ingrese un peso válido.");
      }

      // Validación de la altura
      while (true) {
            altura = parseFloat(prompt("Ingrese su altura en metros. Ej: 1.75:"));
            if (!isNaN(altura) && altura > 0) break;
            alert("Por favor, ingrese una altura válida.");
      }

      // Validación del sexo
      while (true) {
            sexo = prompt("Ingrese su sexo M (Masculino) o F (Femenino):").toUpperCase();
            if (sexo === "M" || sexo === "F") break;
            alert("Por favor, ingrese un sexo válido (M o F).");
      }

      // Validacion de la edad
      while (true) {
            edad = parseInt(prompt("Ingrese su edad:"));
            if (!isNaN(edad) && edad > 0) break;
            alert("Por favor, ingrese una edad válida.");
      }

      // Validacion del nivel de actividad fisca
      while (true) {
            actividad = parseInt(
                  prompt(
                  "Ingrese su nivel de actividad física (1-4):\n1.- Sedentario.\n2.- Poco ejercicio.\n3.- Ejercicio Moderado.\n4.- Ejercicio intenso."
                  )
            );
            if (actividad >= 1 && actividad <= 4) break;
            alert("Por favor, seleccione un nivel de actividad válido (1-4).");
      }

      // Validación del objetivo
      while (true) {
            objetivo = parseInt(
                  prompt(
                  "Ingrese cuales son sus objetivos (1-3):\n1.- Perder grasa corporal.\n2.- Mantener mi físico.\n3.- Ganar masa muscular.")
            );
            if (objetivo >= 1 && objetivo <= 3) break;
            alert("Por favor, seleccione un objetivo válido (1-3).");
      }

      // Calculo del Gasto Energetico Basal (GEB)
      let GEB;

      if (sexo === "M") {
            GEB = (10 * peso) + (6.25 * altura * 100) - (5 * edad) + 5; // GEB masculino
      } else {
            GEB = (10 * peso) + (6.25 * altura * 100) - (5 * edad) - 161; // GEB femenino
      }

      // Arreglo para almacenar el factor de actividad
      const factorActividad = [
            1.2, // Sedentario
            1.375, // Poco ejercicio
            1.55, // Ejercicio moderado
            1.725 // Ejercicio intenso
      ];

      // Calculo del Gasto Energetico Total (GCT)
      const GCT = GEB * factorActividad[actividad - 1];

      let caloriasFinales;

      if (objetivo === 1) {
            caloriasFinales = GCT - 350; // Perder grasa corporal
      } else if (objetivo === 2) {
            caloriasFinales = GCT; // Mantener el fisico
      } else {
            caloriasFinales = GCT + 450; // Ganar masa muscular
      }

      alert(`Su gasto calórico total es de ${GCT.toFixed(2)} calorías al día.\nPara su objetivo, consumir aproximadamente ${caloriasFinales.toFixed(2)} calorías por día.`);
}

// Función que inicia el simulador
function inicio() {
      // Menu de opciones para el usuario
      while (true) {
            const opcion = parseInt(prompt(
                  "Seleccione una opción:\n1. Calcular IMC\n2. Calcular calorias necesarias\n3. Salir"
            ));

            if (opcion === 1) {
                  calcularIMC();
            } else if (opcion === 2) {
                  calcularCalorias();
            } else if (opcion === 3) {
                  alert("Gracias por usar el Simulador Fitness.");
                  break; // Salir del bucle
            } else {
                  alert("Por favor, seleccione una opción válida.");
            }
      };
}

// Boton para iniciar el simulador
const boton = document.getElementById("iniciar");
boton.addEventListener("click", () => {
  inicio();
});