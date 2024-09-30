import React from 'react';
import style from "../../styles/user/authentication.module.css";
import authService from '../../auth/authService';
const AuthService = new authService();
import { useNavigate } from 'react-router-dom';

function reducer(state: any, action: { type: string; payload: string; }) {
    switch (action.type) {
        case 'username':
            return { ...state, username: action.payload }
        case "password":
            return { ...state, password: action.payload }
        default:
            return state
    }
}

function Login() {
    const navigate = useNavigate();
    const [state, dispatch] = React.useReducer(reducer, {
        username: "",
        password: "",
    })

    function signIn(e: React.SyntheticEvent) {
        e.preventDefault()
        const fetchParams = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: state.username,
                password: state.password
            })
        }

        fetch("/api/users/login", fetchParams)
            .then(res => res.json())
            .then(data => {
                AuthService.setLocalStorage(data)
                data.success == true && navigate("/")
            })
            .catch(error => console.error(`error trying to login to  account, ${error}`))

    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        dispatch({ type: name as "username" | "password", payload: value })
    }

    return (
        <div>
            <form className={style.form} onSubmit={signIn} autoComplete='off'>
                <div className={style.miniForm}>
                    <label htmlFor="username">Username</label>
                    <input className={style.formInput} type="text" name="username" onChange={handleChange} value={state.username} />
                </div>
                <div className={style.miniForm}>
                    <label htmlFor="password">Password</label>
                    <input className={style.formInput} type="password" name="password" onChange={handleChange} value={state.password} />
                </div>
                <button className={style.formSubmit}>Login</button>
            </form>
        </div>
    )
}

export default Login