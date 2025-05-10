import './Profile.css'
import '../../assets/icons/profile_image.jpg'

export default function Profile(){
    return(
        <dev className='Profile_unit.dark'>
            <div className="profile_picture">
                <image></image>
            </div>
            <div className="profile_name">
                USERNAME
            </div>
            <div className="btn_container">
                <button className="logout_btn">Log out</button>
            </div>
        </dev>
    )
}