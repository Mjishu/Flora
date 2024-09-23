import React from 'react';
import { UseUser } from '../components/user/userContext';
import style from "../styles/profile.module.css";

function Profile() {
    const { currentUser, userLoading } = UseUser();
    const [showTimezone, setShowTimezone] = React.useState(false);
    const [timezones, setTimezones] = React.useState(null);
    const [newTimezone, setNewTimezone] = React.useState("") //* change this maybe to include other user options? or curentUser.timezone?

    if (userLoading) {
        return <h1>Loading...</h1>
    }

    React.useEffect(() => {
        fetch("/api/users/timezones")
            .then(res => res.json())
            .then(data => setTimezones(data))
            .catch(err => console.error(`There was an error trying to fetch timezones: ${err}`))
    }, [])

    function updateUser() {
        const token = localStorage.getItem("token");
        if (!token || token === null) { return console.error("Invalid token") }
        const fetchParams = {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: token },
            body: JSON.stringify(newTimezone)
        }
    }

    function updateTimezone(timezone: unknown) {
        setNewTimezone(timezone)
    }

    const mappedTimezones = timezones.map(zone => {
        return <div className={style.zone} onClick={() => updateTimezone(zone)}>
            <h5>{zone.name}</h5>
        </div >
    })

    return (
        <div>
            <h1>Welcome {currentUser.username}</h1>
            <div>
                <button class={style.userTimezones} onClick={() => setShowTimezone(prev => !prev)}>Timezone</button>
                <div className={style.timezoneHolder}>
                    {showTimezone && mappedTimezones}
                </div>
            </div>
        </div>
    )
}

export default Profile