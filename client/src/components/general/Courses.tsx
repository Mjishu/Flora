import React from 'react'
import Navbar from './Navbar'
import { UseUser } from '../user/userContext'
import { useParams } from 'react-router-dom'
import { User } from "../../types"
import style from "../../styles/course.module.css"

interface Course {
    id: string;
    title: string;
    image_src: string | null;
    units: Units[];
}

interface Units {
    id: string;
    title: string;
    description: string;
    course_id: string;
    unit_order: number;
    lessons: Lessons[]
}

interface Lessons {
    id: string;
    title: string;
    unit_id: string;
    lesson_order: number;
}


/* How to
    Get course from backend 
*/
function useCourse(currentUser: User | null, courseId: string | undefined) {
    const [course, setCourse] = React.useState<Course | undefined>(undefined)
    const [courseLoading, setCourseLoading] = React.useState<boolean>(true)

    React.useEffect(() => {
        try {
            fetch(`/api/courses/${courseId}`)
                .then(res => res.json())
                .then(data => setCourse(data.course))
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

    function lessonsMapped(lessons: Lessons[]) {
        if (!lessons) {
            console.error("unit could not be located")
            return []
        }
        const lessonsMapped = lessons.map(lesson => {
            return (
                <button onClick={() => console.log(`lesson ${lesson.title} clicked`)} key={lesson.id} className={style.lesson_button}>
                    <img className={style.lesson_image} width={120} height={120} src={`/icons/Plants/leafs_${lesson.lesson_order}.svg`} alt={`${lesson.lesson_order}`} />
                    {/* <h6>{lesson.title}</h6> todo Return an icon here and when you hover over it or below the icon show the name? */}
                </button>
            )
        })
        return lessonsMapped
    }

    const unitsMapped = course?.units.map(unit => { //todo style this how i want it to be styled
        return (
            <div key={unit.id}>
                <h3>{unit.title}</h3>
                {lessonsMapped(unit.lessons)}
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