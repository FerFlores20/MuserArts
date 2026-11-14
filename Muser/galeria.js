document.addEventListener('DOMContentLoaded', () => {
    const formSubida = document.getElementById('formSubida');
    const inputImagen = document.getElementById('inputImagen');
    const inputTitulo = document.getElementById('inputTitulo');
    const galeriaGrid = document.getElementById('galeriaGrid');
    const nombreArchivo = document.getElementById('nombreArchivo');

    // Elementos del modal de zoom
    const modal = document.getElementById('modalZoom');
    const imgAmpliada = document.getElementById('imgAmpliada');
    const tituloAmpliado = document.getElementById('tituloAmpliado');
    const btnCerrar = document.querySelector('.btn-cerrar');

    // Mostrar el nombre del archivo seleccionado de forma bonita
    inputImagen.addEventListener('change', () => {
        if (inputImagen.files.length > 0) {
            nombreArchivo.textContent = inputImagen.files[0].name;
        } else {
            nombreArchivo.textContent = 'Ningún archivo seleccionado';
        }
    });

    // Obras iniciales o recuperadas del navegador
    let obras = JSON.parse(localStorage.getItem('muserObras')) || [
        { url: 'obra1.png', titulo: 'Ilustración 1' },
        { url: 'obra2.png', titulo: 'Ilustración 2' },
        { url: 'obra3.png', titulo: 'Ilustración 3' },
        { url: 'obra4.png', titulo: 'Ilustración 4' }
    ];

    function renderizarGaleria() {
        galeriaGrid.innerHTML = '';
        obras.forEach((obra, index) => {
            const item = document.createElement('div');
            item.classList.add('galeria-item');
            
            item.innerHTML = `
                <div class="obra-contenido">
                    <img src="${obra.url}" alt="${obra.titulo}" onclick="abrirZoom('${obra.url}', '${obra.titulo}')">
                    <p class="obra-titulo">${obra.titulo}</p>
                    <button class="btn-eliminar" onclick="event.stopPropagation(); eliminarObra(${index})">🗑️</button>
                </div>
            `;
            galeriaGrid.appendChild(item);
        });
    }

    // Subir imagen
    formSubida.addEventListener('submit', (e) => {
        e.preventDefault();
        const archivo = inputImagen.files[0];
        const titulo = inputTitulo.value;

        if (archivo) {
            const lector = new FileReader();
            lector.onload = function(evento) {
                const nuevaObra = {
                    url: evento.target.result,
                    titulo: titulo
                };

                obras.unshift(nuevaObra);
                localStorage.setItem('muserObras', JSON.stringify(obras));
                
                renderizarGaleria();
                formSubida.reset();
                nombreArchivo.textContent = 'Ningún archivo seleccionado';
            };
            lector.readAsDataURL(archivo);
        }
    });

    // Eliminar obra
    window.eliminarObra = function(index) {
        if (confirm('¿Estás segura de eliminar esta obra de la galería?')) {
            obras.splice(index, 1);
            localStorage.setItem('muserObras', JSON.stringify(obras));
            renderizarGaleria();
        }
    };

    // Funciones para el Zoom (Pantalla completa al hacer clic)
    window.abrirZoom = function(url, titulo) {
        modal.style.display = 'flex';
        imgAmpliada.src = url;
        tituloAmpliado.textContent = titulo;
    };

    function cerrarZoom() {
        modal.style.display = 'none';
    }

    btnCerrar.addEventListener('click', cerrarZoom);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) cerrarZoom();
    });

    // Render inicial
    renderizarGaleria();
});