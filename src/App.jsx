import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ConvertidorImagenes = () => {
  const convertImages = async () => {
    const directorioImagenes = '\\192.168.0.67\Logistica\Fotos';
    const directorioSalida = 'C:\Users\SyD Colombia SA\Desktop\n';
    const rutaArchivoExcel = 'C:\Users\SyD Colombia SA\Desktop\InventarioNuevo1.xlsx';
    const rangoCeldasIDs = 'A2:A6';

    try {
      // Leer el archivo de Excel
      const workbook = XLSX.readFile(rutaArchivoExcel);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      // Obtener los IDs del archivo de Excel
      const range = XLSX.utils.decode_range(rangoCeldasIDs);
      const ids = [];
      for (let row = range.s.r; row <= range.e.r; row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: range.s.c });
        const cell = sheet[cellAddress];
        if (cell && cell.t === 'n') {
          const id = cell.v;
          ids.push(id);
        }
      }

      // Procesar las imágenes
      for (const id of ids) {
        const nombreArchivo = id.toString();
        const archivo = `${directorioImagenes}${nombreArchivo}.png`;

        // Verificar si el archivo existe y es una imagen PNG
        if (fs.existsSync(archivo) && archivo.toLowerCase().endsWith('.png')) {
          // Leer la imagen PNG
          const imagen = await loadImage(archivo);

          // Crear una nueva imagen con fondo blanco
          const imagenRedimensionada = createWhiteImage(300, 300);
          const canvas = imagenRedimensionada.getContext('2d');
          canvas.drawImage(imagen, 0, 0, 300, 300);

          // Guardar la imagen convertida en formato JPEG
          const rutaSalida = `${directorioSalida}${nombreArchivo}.jpg`;
          await saveImage(imagenRedimensionada, rutaSalida);

          console.log(`Se ha convertido ${archivo} a JPEG y redimensionado a 300x300 píxeles.`);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);
      img.src = url;
    });
  };

  const createWhiteImage = (width, height) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    return canvas;
  };

  const saveImage = (canvas, filename) => {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        saveAs(blob, filename);
        resolve();
      }, 'image/jpeg', 1);
    });
  };

  return (
    <div>
      <button onClick={convertImages}>Convertir imágenes</button>
    </div>
  );
};

function App() {
  return (
    <div>
      <h1>Convertidor de Imágenes</h1>
      <ConvertidorImagenes />
    </div>
  );
}

export default App;
