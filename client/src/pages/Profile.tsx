import React from 'react';
import { UseUser } from '../components/user/userContext';
import style from "../styles/user/profile.module.css";
import Navbar from '../components/general/Navbar';

interface timezoneInterface {
    id: number,
    zone: string,
    utc_offset: string
}

interface userInfo {
    username: string | undefined;
    email: string | undefined;
    timezone: string | undefined;
}
type ActionType = "username" | 'email' | "timezone";
interface Action {
    type: ActionType;
    payload: string;
}

function reducer(state: userInfo, action: Action) {
    switch (action.type) {
        case 'username':
            return { ...state, username: action.payload }
        case "email":
            return { ...state, email: action.payload }
        case "timezone":
            return { ...state, timezone: action.payload }
        default:
            return state
    }
}

function Profile() {
    const { currentUser, userLoading } = UseUser();
    const [loading, setLoading] = React.useState(true);
    const [showTimezone, setShowTimezone] = React.useState(false);
    const [showEdit, setShowEdit] = React.useState(false);
    const [timezones, setTimezones] = React.useState<timezoneInterface[] | undefined>(undefined);
    const [state, dispatch] = React.useReducer<React.Reducer<userInfo, Action>>(reducer, {
        username: currentUser?.username || "", email: currentUser?.email || "", timezone: currentUser?.zone || undefined
    } as userInfo)

    React.useEffect(() => {
        fetch("/api/users/timezones")
            .then(res => res.json())
            .then(data => {
                setTimezones(data)
                setLoading(false)
            })
            .catch(err => console.error(`There was an error trying to fetch timezones: ${err}`))
    }, [])

    React.useEffect(() => {
        if (currentUser) {
            dispatch({ type: 'username', payload: currentUser.username || '' });
            dispatch({ type: 'email', payload: currentUser.email || '' });
            dispatch({ type: 'timezone', payload: currentUser.zone });
        }
        console.log(`current users zone : ${currentUser?.zone}`)
    }, [currentUser])

    if (userLoading || loading) {
        return <h1>Loading...</h1>
    }

    if (!currentUser) {
        return <h1>Could not find current user</h1>
    }


    function updateUser() {
        const token = localStorage.getItem("token");
        if (!token || token === null) { return console.error("Invalid token") }
        const fetchParams = {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: token },
            body: JSON.stringify(state)
        }
        state.timezone ? fetch(`/api/users/update/${currentUser?.id}`, fetchParams)
            .then(res => res.json()).then(data => console.log(data)).catch(err => console.error(`error updating user: ${err}`)) : console.log("Timezone is not delcared")

        setShowEdit(false)
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        dispatch({ type: name as ActionType, payload: value })
    }

    function updateTimezone(timezone: timezoneInterface) {
        dispatch({ type: "timezone", payload: timezone.zone })
    }

    const mappedTimezones = timezones && timezones.map((timezone: timezoneInterface) => {
        return (
            <div className={style.zone} key={timezone.id} onClick={() => updateTimezone(timezone)}>
                <h5>{timezone.zone}</h5>
                <p>{timezone.utc_offset}</p>
            </div >)
    })

    return (
        <div className="content">
            <Navbar />
            <div>
                <h1>Welcome {currentUser.username}</h1>
                <p>Your current Timezone is {currentUser.zone}</p>
                <button onClick={() => setShowEdit(true)}>Edit</button>
                {showEdit &&
                    <div className={style.editInfo}>
                        <button className={style.userTimezones} onClick={() => setShowTimezone(prev => !prev)}>Timezone</button>
                        <div className={`${showTimezone && style.timezoneHolder}`}>
                            {showTimezone && mappedTimezones}
                        </div>
                        <label htmlFor="username">Username</label>
                        <input type="text" value={state.username} name="username" onChange={handleChange} />
                        <label htmlFor="email">Email</label>
                        <input type="text" value={state.email} name="email" onChange={handleChange} />
                        <button className={style.saveButton} onClick={updateUser}>Save</button>
                    </div>
                }
            </div>
        </div>
    )
}

export default Profile