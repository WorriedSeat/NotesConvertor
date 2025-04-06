import './CmpContent.css';
import './TextSection.css';
import './ImageSection.css';
import './Buttons.css';
import ImageHandler from './ImageHandler';



export default function CmpContent(){
    return(
        <main className="content">
            <div className='section-container'>
                <ImageHandler />

                <div className="text-section">
                  <textarea className="text-display" placeholder="The text from the image will appear here..."></textarea>
                </div>
            </div>

            <div className="action-buttons">
                <div className='image-buttons'>
                    <button className="btn rewrite-btn">Rewrite</button>
                </div>
                <div className='text-buttons'>
                    <button className="btn download-btn">Download</button>
                </div>
            </div>
    </main>
    )
}