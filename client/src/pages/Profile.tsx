import React from 'react';
import { UseUser } from '../components/user/userContext';
import style from "../styles/profile.module.css";
import Navbar from '../components/general/Navbar';


function Profile() {
    interface timezoneInterface {
        id: number,
        zone: string,
        utc_offset: string
    }

    const { currentUser, userLoading } = UseUser();
    const [loading, setLoading] = React.useState(true);
    const [showTimezone, setShowTimezone] = React.useState(false);
    const [timezones, setTimezones] = React.useState<timezoneInterface[] | null>(null);
    const [newTimezone, setNewTimezone] = React.useState<timezoneInterface | null>(null) //* change this maybe to include other user options? or curentUser.timezone?

    React.useEffect(() => {
        fetch("/api/users/timezones")
            .then(res => res.json())
            .then(data => {
                setTimezones(data)
                setLoading(false)
            })
            .catch(err => console.error(`There was an error trying to fetch timezones: ${err}`))
    }, [])

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
            body: JSON.stringify(newTimezone)
        }
        fetch(`/api/users/update/${currentUser?.id}`, fetchParams)
            .then(res => res.json()).then(data => console.log(data)).catch(err => console.error(`error updating user: ${err}`))
    }

    function updateTimezone(timezone: timezoneInterface) {
        setNewTimezone(timezone)
    }

    const mappedTimezones = timezones && timezones.map((timezone: timezoneInterface) => {
        return (
            <div className={style.zone} key={timezone.id} onClick={() => updateTimezone(timezone)}>
                <h5>{timezone.zone}</h5>
                <p>{timezone.utc_offset}</p>
            </div >)
    })

    return (
        <div>
            <Navbar />
            <h1>Welcome {currentUser.username}</h1>
            <p>Your current Timezone is {currentUser.zone}</p>
            <div>
                <button className={style.userTimezones} onClick={() => setShowTimezone(prev => !prev)}>Timezone</button>
                <div className={`${showTimezone && style.timezoneHolder}`}>
                    {showTimezone && mappedTimezones}
                </div>
            </div>
            <button className={style.saveButton} onClick={updateUser}>Save</button>
        </div>
    )
}

export default Profile