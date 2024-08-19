import React from 'react'
import style from "../../styles/authentication.module.css"

function Login() {
    const [userInfo, setUserInfo] = React.useState({
        username: "",
        password: "",
    })

    function signIn(e: any) {
        e.preventDefault()
        const fetchParams = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: userInfo.username,
                password: userInfo.password
            })
        }

        fetch("/api/users/login", fetchParams)
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(error => console.error(`error trying to login to  account, ${error}`))
    }

    function handleChange(e: any) {
        const { name, value } = e.target;
        setUserInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }))
    }

    return (
        <div>
            <form className={style.form} onSubmit={signIn} autoComplete='off'>
                <div className={style.miniForm}>
                    <label htmlFor="username">Username</label>
                    <input className={style.formInput} type="text" name="username" onChange={handleChange} value={userInfo.username} />
                </div>
                <div className={style.miniForm}>
                    <label htmlFor="password">Password</label>
                    <input className={style.formInput} type="password" name="password" onChange={handleChange} value={userInfo.password} />
                </div>
                <button className={style.formSubmit}>Login</button>
            </form>
        </div>
    )
}

export default Login