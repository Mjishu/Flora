import React from 'react'
import Navbar from './Navbar'
import { UseUser } from '../user/userContext'
import { useParams } from 'react-router-dom'

interface User {
    username: string;
    email: string;
    id: string;
    zone: string
}

/* How to
    Get course from backend 
*/
function useCourse(currentUser: User | null, courseId: string | undefined) {
    const [course, setCourse] = React.useState({ courses: undefined, units: undefined, lessons: undefined })
    const [courseLoading, setCourseLoading] = React.useState<boolean>(true)

    React.useEffect(() => {
        try {
            fetch(`/api/courses/${courseId}`)
                .then(res => res.json())
                .then(data => setCourse(data))
                .catch(err => console.error(`there was error in fetching course: ${err}`))
                .finally(() => setCourseLoading(false))
        } catch (err) {
            console.log(`there was an error fetching course! ${err}`)
            return
        }
    }, [])

    return { course, courseLoading }
}

function Courses() {
    const { currentUser, userLoading } = UseUser();
    const { id } = useParams();
    const { course, courseLoading } = useCourse(currentUser, id);

    console.log(`the id of this page is ${id}`)
    console.log("the courses,units and lessons are: ", course)

    if (userLoading || courseLoading) { return <h1>Loading...</h1> }


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