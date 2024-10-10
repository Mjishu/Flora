import React from 'react'
import Navbar from './Navbar'
import { UseUser } from '../user/userContext'
import { useParams } from 'react-router-dom'
import { User } from "../../types"

interface Courses {
    id: string;
    title: string;
    image_src: string | null;
}

interface Units {
    id: string;
    title: string;
    description: string;
    course_id: string;
    unit_order: number;
}

interface Lessons {
    id: string;
    title: string;
    unit_id: string;
    lesson_order: number;
}

interface CourseData {
    courses: Courses;
    units: Units[];
    lessons: Array<Array<Lessons>> | [];
}

/* How to
    Get course from backend 
*/
function useCourse(currentUser: User | null, courseId: string | undefined) {
    const [course, setCourse] = React.useState<CourseData | undefined>(undefined)
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

    if (userLoading || courseLoading) { return <h1>Loading...</h1> }

    function lessonsMapped(unitId: string) {
        if (!course) {
            console.error("Course could not be located")
            return []
        }
        let unit_lessons;
        console.log(course.lessons)
        for (const lesson of course.lessons) {
            if (lesson.length < 1) {
                console.log("There are no lessons to select")
                return []
            }
            if (lesson[0].unit_id === unitId) {
                unit_lessons = lesson;
                return []
            }
        }
        return unit_lessons;
    }

    const unitsMapped = course?.units.map(unit => { //todo style this how i want it to be styled
        return (
            // <button key={unit.id} onClick={() => console.log(`unit ${unit.title} clicked`)}>
            //     <p>{unit.title}</p>
            // </button>
            <div key={unit.id}>
                <h3>{unit.title}</h3>
                {lessonsMapped(unit.id)}
            </div>
        )
    })


    return (
        <div className='content'>
            <Navbar />
            <div>
                <p>Courses</p>
                {unitsMapped}
            </div>
        </div>
    )
}

export default Courses