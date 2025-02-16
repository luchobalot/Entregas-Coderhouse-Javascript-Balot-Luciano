// Array de sugerencias segun el IMC
const sugerenciasIMC = [
      "Se recomienda consultar con un nutricionista para aumentar su peso de forma saludable.",
      "¡Felicitaciones! Mantenga sus hábitos saludables.",
      "Se recomienda aumentar la actividad física y mejorar la alimentación.",
      "Se recomienda consultar con un profesional de la salud para establecer un plan de pérdida de peso."
  ];
  
  // Recuperar el ultimo IMC calculado y los valores si es que existen
  document.addEventListener("DOMContentLoaded", function () {
      const datosGuardados = obtenerDatosGuardados();
      
      if (datosGuardados.resultado) {
          mostrarResultado(datosGuardados.resultado);
          
          if (datosGuardados.peso) {
              document.getElementById("peso").value = datosGuardados.peso;
          }
          
          if (datosGuardados.altura) {
              document.getElementById("altura").value = datosGuardados.altura;
          }
      }
  });
  
  // Función para obtener datos guardados
  function obtenerDatosGuardados() {
      return {
          resultado: localStorage.getItem("ultimoIMC"),
          peso: localStorage.getItem("ultimoPeso"),
          altura: localStorage.getItem("ultimaAltura")
      };
  }
  
  // Función para guardar datos
  function guardarDatos(datos) {
      localStorage.setItem("ultimoIMC", datos.resultado);
      localStorage.setItem("ultimoPeso", datos.peso);
      localStorage.setItem("ultimaAltura", datos.altura);
  }
  
  // Función para calcular el IMC
  function calcularIMC(peso, altura) {
      const IMC = peso / (altura * altura); // Formula IMC
      let clasificacion = "";
      let indiceSugerencia = 0;
  
      if (IMC < 18.5) {
          clasificacion = "Bajo peso";
          indiceSugerencia = 0;
      } else if (IMC >= 18.5 && IMC <= 24.9) {
          clasificacion = "Peso normal";
          indiceSugerencia = 1;
      } else if (IMC >= 25 && IMC <= 29.9) {
          clasificacion = "Sobrepeso";
          indiceSugerencia = 2;
      } else {
          clasificacion = "Obesidad";
          indiceSugerencia = 3;
      }
  
      return {
          IMC: IMC.toFixed(2),
          clasificacion,
          sugerencia: sugerenciasIMC[indiceSugerencia],
      };
  }
  
  // Función para manejar el envío del formulario
  document.getElementById("imcForm").addEventListener("submit", function (event) {
      event.preventDefault();
  
      const peso = parseFloat(document.getElementById("peso").value);
      const altura = parseFloat(document.getElementById("altura").value);
  
      // Validaciones más específicas
      let mensajeError = "";
  
      // Validar peso
      if (isNaN(peso) || peso <= 0) {
          mensajeError = "Por favor, ingrese un peso válido.";
      } else if (peso > 500) {
          mensajeError = "Advertencia: El peso ingresado supera el límite máximo de 500 kg.";
      }
  
      // Validar altura
      if (isNaN(altura) || altura <= 0) {
          mensajeError = "Por favor, ingrese una altura válida.";
      } else if (altura > 2.5) {
          mensajeError = "Advertencia: La altura ingresada supera el límite máximo de 2.5 metros.";
      } else if (altura < 0.5) {
          mensajeError = "Advertencia: La altura ingresada es menor al límite mínimo de 0.5 metros.";
      }
  
      // Si hay error, mostrar mensaje y detener el cálculo
      if (mensajeError) {
          mostrarResultado(mensajeError);
          return;
      }
  
      // Si pasa las validaciones, continuar con el cálculo
      const resultado = calcularIMC(peso, altura);
      const mensaje = `Su IMC es de <strong>${resultado.IMC}</strong>. <br>
                      Clasificación: <strong>${resultado.clasificacion}</strong>. <br>
                      ${resultado.sugerencia}`;
  
      // Guardar todos los datos
      guardarDatos({
          resultado: mensaje,
          peso: peso,
          altura: altura
      });
  
      // Mostrar el resultado en la página
      mostrarResultado(mensaje);
  });
  
  // Función para mostrar el resultado en el HTML
  function mostrarResultado(mensaje) {
      const resultadoDiv = document.getElementById("resultado");
      resultadoDiv.innerHTML = mensaje;
      resultadoDiv.classList.add("mostrar");
  }
  
  // Botón para limpiar el almacenamiento y resetear los datos
  document.getElementById("resetIMC").addEventListener("click", function () {
      // Limpiar localStorage
      localStorage.removeItem("ultimoIMC");
      localStorage.removeItem("ultimoPeso");
      localStorage.removeItem("ultimaAltura");
      
      // Limpiar y ocultar resultado
      const resultadoDiv = document.getElementById("resultado");
      resultadoDiv.innerHTML = "";
      resultadoDiv.classList.remove("mostrar");
      
      // Resetear formulario
      document.getElementById("imcForm").reset();
  });