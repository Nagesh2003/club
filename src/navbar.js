import React from "react";
import { useNavigate } from 'react-router-dom'
// import './navbar.css'
import './navbar.css'
//port  flylogo from './flylogo.jpeg';
import flylogo from './flylogo.jpeg'
const Navbar = () => {
    const navigete = useNavigate();
    const handleHome = () => {
        navigete('/')
    }
    const handleUpcoming=()=>{
        navigete('/upcoming');
    }
    const handleactivity=()=>{
        navigete('/activities');
    }

    const handleShedule = () => {
        navigete('/schedule')
    }
    return (
        <div className="Nav-container">



            <div className="Nav-left" id="logo">
               <img onClick={handleHome}  src={flylogo} alt="fly log"/>
            </div>
            <div className="Nav-right">
                <p onClick={handleShedule} className="border">🎦 Schedule Meet</p>
                
                <p onClick={handleUpcoming} className="border">🕒 upcoming meetings</p>
              
                <p onClick={handleactivity} className="border">🏆 activities</p>
                <p onClick={handleHome} className="border">🏠︎ Home</p>

            </div>



        </div>






    )
}

export default Navbar;