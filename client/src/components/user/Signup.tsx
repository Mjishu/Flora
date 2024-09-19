import React from 'react';
import style from "../../styles/authentication.module.css";
import authService from '../../auth/authService';
const AuthService = new authService();
import { useNavigate } from 'react-router-dom';

function reducer(state: any, action: { type: string; payload: string; }) {
    switch (action.type) {
        case 'username':
            return { ...state, username: action.payload }
        case "password":
            return { ...state, password: action.payload }
        case "email":
            return { ...state, email: action.payload }
        case "confirmPassword":
            return { ...state, confirmPassword: action.payload }
        default:
            return state
    }
}

function Signup() {
    const navigate = useNavigate();
    const [state, dispatch] = React.useReducer(reducer, {
        username: "",
        password: "",
        email: "",
        confirmPassword: ""
    })

    function signIn(e) {
        e.preventDefault()
        const fetchParams = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: state.username,
                email: state.email,
                password: state.password
            })
        }

        fetch("/api/users/register", fetchParams) //! CORS issue? or what bc i can find it when i type the address in browser?
            .then(res => res.json())
            .then(data => {
                AuthService.setLocalStorage(data)
                data.success && navigate("/")
            })
            .catch(error => console.error(`error trying to create account, ${error}`))
    }

    function handleChange(e) {
        const { name, value } = e.target;
        dispatch({ type: name, payload: value })
    }

    return (
        <div>
            <form className={style.form} onSubmit={signIn} autoComplete='off'>
                <div className={style.miniForm}>
                    <label htmlFor="username">Username</label>
                    <input className={style.formInput} type="text" name="username" onChange={handleChange} value={state.username} />
                </div>
                <div className={style.miniForm}>
                    <label htmlFor="email">Email</label>
                    <input className={style.formInput} type="email" name="email" onChange={handleChange} value={state.email} />
                </div>
                <div className={style.miniForm}>
                    <label htmlFor="password">Password</label>
                    <input className={style.formInput} type="password" name="password" onChange={handleChange} value={state.password} />
                </div>
                <div className={style.miniForm}>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input className={style.formInput} type="password" name="confirmPassword" onChange={handleChange} value={state.confirmPassword} />
                </div>
                <button className={style.formSubmit}>Sign Up</button>
            </form>
        </div>
    )
}

export default Signup