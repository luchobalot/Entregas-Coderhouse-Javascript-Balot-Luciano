// Clase que maneja los calculos de las calorías necesarias
class CalculadoraCalorias {
    constructor() {
        this.factoresActividad = {
            1: { valor: 1.2, descripcion: "Sedentario" },
            2: { valor: 1.375, descripcion: "Ligero" },
            3: { valor: 1.55, descripcion: "Moderado" },
            4: { valor: 1.725, descripcion: "Intenso" }
        };

        this.objetivos = {
            1: { factor: 0.85, descripcion: "Perder grasa" },
            2: { factor: 1, descripcion: "Mantener peso" },
            3: { factor: 1.15, descripcion: "Ganar músculo" }
        };
    }

    // Cálculo de la Tasa Metabólica Basal (TMB)
    calcularTMB(datos) {
        const { peso, altura, edad, sexo } = datos;
        return sexo === 'M' 
            ? (10 * peso + 6.25 * altura - 5 * edad + 5)
            : (10 * peso + 6.25 * altura - 5 * edad - 161); // Si es mujer (F), uso otra fórmula con un valor de ajuste de -161.
    }

    // Calculo del Gasto Energetico Total (GCT)
    calcularGCT(tmb, nivelActividad) {
        return tmb * this.factoresActividad[nivelActividad].valor;
    }

    calcularCaloriasObjetivo(gct, objetivo) {
        return gct * this.objetivos[objetivo].factor;
    }
}

// Clase para manejar el localStorage y guardar los datos del usuario
class AlmacenamientoDatos {
    constructor() {
        this.key = 'datosUsuario';
    }

    guardar(datos) {
        localStorage.setItem(this.key, JSON.stringify(datos));
    }

    obtener() {
        return JSON.parse(localStorage.getItem(this.key)) || null;
    }

    limpiar() {
        localStorage.removeItem(this.key);
    }
}

// Clase para manejar la UI
class InterfazUsuario {
    constructor(calculadora, almacenamiento) {
        this.calculadora = calculadora;
        this.almacenamiento = almacenamiento;
        this.inicializarElementos();
        this.inicializarEventos();
        this.cargarDatosGuardados();
    }

    inicializarElementos() {
        this.form = document.getElementById('caloriasForm');
        this.resultado = document.getElementById('resultado');
        this.caloriasElement = document.getElementById('calorias');
        this.resetearButton = document.getElementById('resetCalorias');
        
        this.opcionesSexo = document.getElementById('sexo-opciones').querySelectorAll('.opcion');
        this.opcionesActividad = document.getElementById('actividad-opciones').querySelectorAll('.opcion');
        this.opcionesObjetivo = document.getElementById('objetivo-opciones').querySelectorAll('.opcion');
        
        this.datosFormulario = {
            sexo: '',
            actividad: 0,
            objetivo: 0
        };
    }

    inicializarEventos() {
        this.form.addEventListener('submit', (e) => this.manejarSubmit(e));
        this.resetearButton.addEventListener('click', () => this.resetearFormulario());
        
        this.inicializarEventosOpciones(this.opcionesSexo, 'sexo');
        this.inicializarEventosOpciones(this.opcionesActividad, 'actividad');
        this.inicializarEventosOpciones(this.opcionesObjetivo, 'objetivo');
    }

    inicializarEventosOpciones(opciones, tipo) {
        opciones.forEach(opcion => {
            opcion.addEventListener('click', () => {
                const valor = tipo === 'sexo' ? opcion.dataset.valor : parseInt(opcion.dataset.valor);
                this.datosFormulario[tipo] = valor;
                this.resaltarOpcion(opciones, opcion);
            });
        });
    }

    cargarDatosGuardados() {
        const datosGuardados = this.almacenamiento.obtener();
        if (datosGuardados) {
            this.datosFormulario = {
                sexo: datosGuardados.sexo,
                actividad: datosGuardados.actividad,
                objetivo: datosGuardados.objetivo
            };

            ['peso', 'altura', 'edad'].forEach(campo => {
                if (datosGuardados[campo]) {
                    document.getElementById(campo).value = datosGuardados[campo];
                }
            });

            this.preseleccionarOpcion(this.opcionesSexo, datosGuardados.sexo);
            this.preseleccionarOpcion(this.opcionesActividad, datosGuardados.actividad);
            this.preseleccionarOpcion(this.opcionesObjetivo, datosGuardados.objetivo);

            if (datosGuardados.ultimoResultado) {
                this.mostrarResultado(datosGuardados.ultimoResultado);
            }
        }
    }

    manejarSubmit(e) {
        e.preventDefault();

        const datos = {
            peso: parseFloat(document.getElementById('peso').value),
            altura: parseFloat(document.getElementById('altura').value),
            edad: parseInt(document.getElementById('edad').value),
            ...this.datosFormulario
        };

        if (!this.validarDatos(datos)) return;

        const tmb = this.calculadora.calcularTMB(datos);
        const gct = this.calculadora.calcularGCT(tmb, datos.actividad);
        const caloriasFinales = this.calculadora.calcularCaloriasObjetivo(gct, datos.objetivo);

        const resultadoTexto = `Su gasto calórico total es de ${gct.toFixed(0)} calorías al día. Para su objetivo, consumir aproximadamente ${caloriasFinales.toFixed(0)} calorías por día.`;
        
        this.mostrarResultado(resultadoTexto);
        this.almacenamiento.guardar({ ...datos, ultimoResultado: resultadoTexto });
    }

    mostrarError(mensaje) {
        const errorAnterior = this.form.querySelector('.error-container');
        if (errorAnterior) {
            errorAnterior.remove();
        }

        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-container';

        const errorMensaje = document.createElement('div');
        errorMensaje.className = 'error-mensaje';
        errorMensaje.textContent = mensaje;

        const closeButton = document.createElement('button');
        closeButton.className = 'close-btn';
        closeButton.innerHTML = '✕';
        closeButton.onclick = () => {
            errorContainer.remove();
        };

        errorContainer.appendChild(errorMensaje);
        errorContainer.appendChild(closeButton);

        this.form.insertBefore(errorContainer, this.form.firstChild);
    }

    // Validar opciones que pueda ingresar mal el usuario
    validarDatos(datos) {
        const errores = [];

        if (!datos.sexo || !datos.actividad || !datos.objetivo) {
            errores.push('Por favor, seleccione todas las opciones');
        }
        
        if (isNaN(datos.edad) || datos.edad < 5 || datos.edad > 100) {
            errores.push('La edad debe estar entre 5 y 100 años');
        }

        if (isNaN(datos.peso) || datos.peso < 15 || datos.peso > 500) {
            errores.push('El peso debe estar entre 15 y 500 kg');
        }

        if (isNaN(datos.altura) || datos.altura < 50 || datos.altura > 220) {
            errores.push('La altura debe estar entre 50 cm y 220 cm');
        }

        if (errores.length > 0) {
            this.mostrarError(errores[0]);
            return false;
        }

        return true;
    }

    mostrarResultado(texto) {
        this.resultado.classList.remove('oculto');
        this.caloriasElement.textContent = texto;
    }

    resetearFormulario() {
        this.form.reset();
        this.resultado.classList.add('oculto');
        this.caloriasElement.textContent = '';
        this.datosFormulario = { sexo: '', actividad: 0, objetivo: 0 };
        this.almacenamiento.limpiar();
        
        [this.opcionesSexo, this.opcionesActividad, this.opcionesObjetivo].forEach(
            opciones => this.desmarcarOpciones(opciones)
        );
    }

    resaltarOpcion(opciones, opcionSeleccionada) {
        opciones.forEach(opcion => opcion.classList.remove('seleccionada'));
        opcionSeleccionada.classList.add('seleccionada');
    }

    desmarcarOpciones(opciones) {
        opciones.forEach(opcion => opcion.classList.remove('seleccionada'));
    }

    preseleccionarOpcion(opciones, valor) {
        opciones.forEach(opcion => {
            if (opcion.dataset.valor === valor.toString()) {
                opcion.classList.add('seleccionada');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const calculadora = new CalculadoraCalorias();
    const almacenamiento = new AlmacenamientoDatos();
    const ui = new InterfazUsuario(calculadora, almacenamiento);
});