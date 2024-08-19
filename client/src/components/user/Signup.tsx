import React from 'react'
import style from "../../styles/authentication.module.css"

function Signup() {
    const [userInfo, setUserInfo] = React.useState({
        username: "",
        password: "",
        email: "",
        confirmPassword: ""
    })

    function signIn(e: any) {
        e.preventDefault()
        const fetchParams = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: userInfo.username,
                email: userInfo.email,
                password: userInfo.password
            })
        }

        fetch("/api/users/signup", fetchParams) //! CORS issue? or what bc i can find it when i type the address in browser?
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(error => console.error(`error trying to create account, ${error}`))
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
                    <label htmlFor="email">Email</label>
                    <input className={style.formInput} type="email" name="email" onChange={handleChange} value={userInfo.email} />
                </div>
                <div className={style.miniForm}>
                    <label htmlFor="password">Password</label>
                    <input className={style.formInput} type="password" name="password" onChange={handleChange} value={userInfo.password} />
                </div>
                <div className={style.miniForm}>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input className={style.formInput} type="password" name="confirmPassword" onChange={handleChange} value={userInfo.confirmPassword} />
                </div>
                <button className={style.formSubmit}>Sign Up</button>
            </form>
        </div>
    )
}

export default Signup