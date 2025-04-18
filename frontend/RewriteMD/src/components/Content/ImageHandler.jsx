import { useState } from 'react';
import './ImageSection.css';
import UploadIcon from '../../assets/icons/upload.svg';
import DeleteIcon from '../../assets/icons/delete.svg';


export default function ImageHandler() {
    const [image, setImage] = useState(null);

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        setImage(URL.createObjectURL(file));
      }
    };
  
    const handleDeleteImage = () => {
      setImage(null);
      document.getElementById('file-upload').value = '';
    };

  return (
    <div className="image-section">
        <div className="image-upload">
        <input type="file" id="file-upload" accept="image/*" className="upload-input" onChange={handleImageUpload} style={{ display: 'none' }}/>
            <div className='button-section'>
                {/* <label htmlFor="file-upload" className="custom-file-button">Choose Image</label> */}
                <label htmlFor="file-upload" className="custom-file-button">
                  <img src={UploadIcon} alt="Upload" className="icon" />
                </label>
                <button className="delete-button" onClick={handleDeleteImage}>
                  <img src={DeleteIcon} alt="Delete" className="icon" />
                </button>
            </div> 
            <div className={`image-preview ${image?.height > 750 ? 'scrollable' : ''}`}>
                {image && <img src={image} alt="Preview" />}
            </div>
        </div>
    </div>
    );
}
