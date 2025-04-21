import { useState } from 'react';
import './ImageSection.css';
import UploadIcon from '../../assets/icons/upload.svg';
import DeleteIcon from '../../assets/icons/delete.svg';

export default function ImageHandler() {
    const [image, setImage] = useState(null);
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please upload an image file');
            return;
        }

        setImage(URL.createObjectURL(file));
        uploadImage(file);
    };

    const uploadImage = async (file) => {
      console.log("Starting upload..."); // [1]
      
      try {
          const formData = new FormData();
          formData.append('file', file);
          console.log("FormData created:", formData); // [2]
  
          const response = await fetch('http://localhost:8000/ingest/image', {
              method: 'POST',
              body: formData
          });
          console.log("Raw response:", response); // [3]
  
          const data = await response.json();
          console.log("Parsed data:", data); // [4]
  
          return data;
      } catch (error) {
          console.error("Full error:", error); // [5]
          throw error;
      }
  };

    const handleDeleteImage = () => {
        setImage(null);
        setResponse(null);
        setError(null);
        document.getElementById('file-upload').value = '';
    };

    return (
        <div className="image-section">
            <div className="image-upload">
                <input
                    type="file"
                    id="file-upload"
                    accept="image/*"
                    className="upload-input"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                />
                <div className="button-section">
                    <label htmlFor="file-upload" className="custom-file-button">
                        <img src={UploadIcon} alt="Upload" className="icon" />
                    </label>
                    <button 
                        className="delete-button" 
                        onClick={handleDeleteImage}
                        disabled={!image}
                    >
                        <img src={DeleteIcon} alt="Delete" className="icon" />
                    </button>
                </div>
                <div className={`image-preview ${image ? 'scrollable' : ''}`}>
                    {image && <img src={image} alt="Preview" />}
                </div>
            </div>
            
            {isLoading && <div className="status-message">Processing image...</div>}
            {error && <div className="error-message">{error}</div>}
            
            {response && (
                <div className="response-section">
                    <h2>Image Details:</h2>
                    <ul>
                        <li>Filename: {response.filename}</li>
                        <li>Dimensions: {response.dimensions}</li>
                        <li>Saved at: {response.saved_path}</li>
                    </ul>
                </div>
            )}
        </div>
    );
}