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

    // Mostrar el nombre del archivo seleccionado
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

    // Subir y comprimir imagen automáticamente para evitar errores de espacio
    formSubida.addEventListener('submit', (e) => {
        e.preventDefault();
        const archivo = inputImagen.files[0];
        const titulo = inputTitulo.value;

        if (archivo) {
            const lector = new FileReader();
            lector.onload = function(evento) {
                const img = new Image();
                img.src = evento.target.result;
                
                img.onload = function() {
                    // Crear un lienzo (canvas) para redimensionar la imagen si es muy grande
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Definir un ancho máximo prudente para web (ej. 1200px)
                    const MAX_WIDTH = 1200;
                    let width = img.width;
                    let height = img.height;

                    if (width > MAX_WIDTH) {
                        height = Math.round((height * MAX_WIDTH) / width);
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convertir a formato comprimido (JPEG/PNG optimizado)
                    const imageUrlCompressed = canvas.toDataURL('image/jpeg', 0.85);

                    const nuevaObra = {
                        url: imageUrlCompressed,
                        titulo: titulo
                    };

                    try {
                        obras.unshift(nuevaObra);
                        localStorage.setItem('muserObras', JSON.stringify(obras));
                        
                        renderizarGaleria();
                        formSubida.reset();
                        nombreArchivo.textContent = 'Ningún archivo seleccionado';
                    } catch (error) {
                        alert('¡El almacenamiento del navegador está lleno! Prueba eliminando algunas obras antiguas para subir nuevas.');
                        obras.shift(); // Revertir si falla
                    }
                };
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

    // Funciones para el Zoom
    window.abrirZoom = function(url, titulo) {
        modal.style.display = 'flex';
        imgAmpliada.src = url;
        tituloAmpliado.textContent = titulo;
    };

    function cerrarZoom() {
        modal.style.display = 'none';
    }

    if (btnCerrar) {
        btnCerrar.addEventListener('click', cerrarZoom);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) cerrarZoom();
        });
    }

    // Render inicial
    renderizarGaleria();
});
