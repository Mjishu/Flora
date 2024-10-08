import React from 'react'
import Navbar from './Navbar'
import { UseUser } from '../user/userContext'

/* How to
    Get course from backend 
*/

function Courses() {
    const { currentUser, userLoading } = UseUser();

    React.useEffect(() => {
        fetch(`/api/courses/course/${"12321"}`)
            .then(res => res.json())
            .then(data => console.log(data))
    }, [])

    return (
        <div className='content'>
            <Navbar />
            <div>
                <p>Courses</p>
            </div>
        </div>
    )
}

export default Courses