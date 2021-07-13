const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e) {
    e.preventDefault();

    // Validar que los campos esten completos
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;
    
    if(ciudad === '' || pais === '') {
        mostrarError('Ambos campos son obligatorios');
        return;
    }

    // Consultando API
    consultarAPI(ciudad, pais);

}

function mostrarError(mensaje) {

    const alerta = document.querySelector('.bg-red-100');

    if(!alerta) {
        // Creando alerta para mostrar a usuario
        const alerta = document.createElement('DIV');
    
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');
    
        alerta.innerHTML = `
            <strong class="font-bold">¡Error!</strong>
            <span class="block">${mensaje}</span>
        `;
    
        container.appendChild(alerta);

        // Eliminando alerta despues de 2 segundos
        setTimeout(() => {
            alerta.remove();
        }, 2000);
    }
}

function consultarAPI(ciudad, pais) {
    const appId = '69df355f4e34611bd0cc46734ff99855';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {

            limpiarHTML(); // Limpiando html

            if(datos.cod === '404') {
                mostrarError('Ciudad no encontrada');

                return;
            }

            // Imprime la respuesta en html
            mostrarClima(datos);
        });
}

function mostrarClima(datos) {
    
    const {name, main: {temp, temp_max, temp_min}} = datos;
    const centigrados = kelvinACentigrado(temp);
    const max = kelvinACentigrado(temp_max);
    const min = kelvinACentigrado(temp_min);

    const nombreCiudad = document.createElement('P');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl');

    const actual = document.createElement('P');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl');

    const tempMaxima = document.createElement('P');
    tempMaxima.innerHTML = `Max: ${max} &#8451;`;
    tempMaxima.classList.add('text-xl');

    const tempMinima = document.createElement('P');
    tempMinima.innerHTML = `Min: ${min} &#8451;`;
    tempMinima.classList.add('text-xl');

    const resultadoDiv = document.createElement('DIV');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);

    resultado.appendChild(resultadoDiv);

}

const kelvinACentigrado = grados => Math.round(grados - 273.15);

function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

