import React from 'react';
import './App.css';
import { UseUser } from "./components/user/userContext";
import authService from './auth/authService';
import Navbar from './components/general/Navbar';
import { useNavigate } from 'react-router-dom';

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

            <button onClick={() => navigate("/plants")}>Learn about Plants</button>
        </div>
    )
}

export default Home