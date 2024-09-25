import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import style from "./styles/homePage.module.css"
import { UseUser } from "./components/user/userContext";
import authService from './auth/authService';
import Navbar from './components/general/Navbar';

const AuthService = new authService();

function Home() {
    const { currentUser, userLoading } = UseUser();
    const [displayUser, setDisplayUser] = React.useState({ username: "", show: false });
    const navigate = useNavigate();

    if (userLoading) {
        return <h1>App is loadiSng</h1>
    }

    function checkSignedIn() {
        setDisplayUser(prevDisplay => ({ ...prevDisplay, username: currentUser?.username ?? "", show: !prevDisplay.show }))
    }
    return (
        <div>
            <Navbar />
            <p>Welcome to flora</p>
            <button onClick={checkSignedIn}>Check logged in status</button>
            <button onClick={() => AuthService.logout()}>Logout</button>
            {displayUser.show && <h2>Your username is {displayUser.username}</h2>}

            <div className={style.kingdomHolder}>
                <button className={`${style.kingdomButton} fs-24`} onClick={() => navigate("/plants")}>Flora</button>
                <button className={`${style.kingdomButton} fs-24`}>Fauna</button>
                <button className={`${style.kingdomButton} fs-24`}>Fungi</button>`
            </div>
        </div>
    )
}

export default Home