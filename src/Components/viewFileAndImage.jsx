import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JSZip from 'jszip';

function ViewFileAndImage() {
  const [imageUrls, setImageUrls] = useState([]);
  const [pdfUrls, setPdfUrls] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`https://localhost:7021/api/Contributions/Download/8`, {
          responseType: 'arraybuffer',
        });

        const zip = await JSZip.loadAsync(response.data);

        const fileNames = Object.keys(zip.files);

        for (const fileName of fileNames) {
          const file = zip.files[fileName];

          if (file.name.endsWith('.jpg') || file.name.endsWith('.jpeg') || file.name.endsWith('.png')) {
            const imageData = await file.async('base64');
            setImageUrls(prevImageUrls => [...prevImageUrls, `data:image/jpeg;base64,${imageData}`]);
          } else if (file.name.endsWith('.pdf')) {
            const pdfData = await file.async('blob');
            const pdfUrl = URL.createObjectURL(pdfData);
            setPdfUrls(prevPdfUrls => [...prevPdfUrls, { name: file.name, url: pdfUrl }]);
          }
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div>
      <h1>Img and File Viewer</h1>
      
      <h2>Images:</h2>
      <div>
        {imageUrls.map((imageUrl, index) => (
          <img key={index} src={imageUrl} alt={`Image ${index}`} style={{ maxWidth: '200px', maxHeight: '200px', margin: '5px' }} />
        ))}
      </div>

      <h2>PDF Documents:</h2>
      <div>
        {pdfUrls.map((pdf, index) => (
          <div key={index}>
            <h3>{pdf.name}</h3>
            <embed src={pdf.url} type="application/pdf" width="100%" height="500px" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewFileAndImage;
