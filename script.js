document.addEventListener('DOMContentLoaded', () => {
    
    const btnProcesar = document.getElementById('btnProcesar'); //
    const inputImagen = document.getElementById('imagenCarrera'); //
    const selectGranPremio = document.getElementById('granPremio'); //
    const selectDivision = document.getElementById('division'); //
    const inputFecha = document.getElementById('fecha'); //
    const selectTipoResultado = document.getElementById('tipoResultado'); //
    
    const divEstado = document.getElementById('estado'); //

    const URL_GENERADOR = 'https://generar-url-subida-88508403231.us-central1.run.app'; //
    const GSHEET_URL = 'https://docs.google.com/spreadsheets/d/11D8zcyPx3AdgPsF_pefks0hmicP3jGm22lDIZF24qAk/edit'; //

    btnProcesar.addEventListener('click', async () => { //
        const archivo = inputImagen.files[0]; //
        
        if (!selectGranPremio.value || !selectDivision.value || !inputFecha.value || !selectTipoResultado.value || !archivo) { //
            divEstado.textContent = 'Error: Por favor, completa todos los campos.'; //
            return; //
        }

        btnProcesar.disabled = true; //
        divEstado.textContent = 'Iniciando subida segura...'; //

        try {
            divEstado.textContent = 'Pidiendo permiso de subida al servidor...'; //
            
            // --- CORRECCIÓN APLICADA AQUÍ ---
            // Se ha verificado el orden correcto de las variables para que coincida con lo que el backend espera.
            // El formato es: GranPremio_Division_Fecha_TipoResultado_Timestamp_NombreArchivoOriginal
            const nombreArchivoUnico = `${selectGranPremio.value}_${selectDivision.value}_${inputFecha.value}_${selectTipoResultado.value}_${Date.now()}_${archivo.name}`; //

            const responseUrl = await fetch(URL_GENERADOR, { //
                method: 'POST', //
                headers: { 'Content-Type': 'application/json' }, //
                body: JSON.stringify({ //
                    fileName: nombreArchivoUnico, //
                    fileType: archivo.type //
                }),
            });

            if (!responseUrl.ok) throw new Error('No se pudo obtener la URL segura del servidor.'); //
            
            const { signedUrl } = await responseUrl.json(); //
            divEstado.textContent = 'Permiso recibido. Subiendo imagen directamente a la nube...'; //

            const responseUpload = await fetch(signedUrl, { //
                method: 'PUT', //
                headers: { 'Content-Type': archivo.type }, //
                body: archivo, //
            });

            if (!responseUpload.ok) throw new Error('La subida del archivo a la nube falló.'); //
            
            divEstado.innerHTML = `
                ¡Subida completada! El procesamiento ha comenzado en el servidor.<br>
                Puedes monitorear el estado detallado en la pestaña <strong>Log_De_Procesos</strong> de tu hoja de cálculo.<br>
                <a href="${GSHEET_URL}" target="_blank" class="sheet-link">Abrir Google Sheet para Verificar</a>
            `; //

        } catch (error) {
            console.error("Error en el proceso de subida:", error); //
            divEstado.textContent = `Error: ${error.message}`; //
        } finally {
            btnProcesar.disabled = false; //
        }
    });
});