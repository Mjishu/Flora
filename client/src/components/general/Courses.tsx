import React from 'react'
import Navbar from './Navbar'
import { UseUser } from '../user/userContext'
import { useNavigate, useParams } from 'react-router-dom'
import { User } from "../../types"
import style from "../../styles/course.module.css"
import { Course, Lessons } from '../../types'

function useCourse(currentUser: User | null, courseId: string | undefined) { //? use currentUser to check user progress?
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
    }, [courseId])

    return { course, courseLoading }
}

function Courses() {
    const { currentUser, userLoading } = UseUser();
    const { id } = useParams();
    const { course, courseLoading } = useCourse(currentUser, id);
    const navigate = useNavigate();

    if (userLoading || courseLoading) { return <h1>Loading...</h1> }

    function LessonsMapped(lessons: Lessons[]) {
        if (!lessons) {
            console.error("unit could not be located")
            return []
        }

        const lessonsMapped = lessons.map(lesson => {
            return (
                <div key={lesson.id} className={style.lesson_container}>
                    {/* <span id={style.lesson_title}>{lesson.title}</span> */}
                    <button onClick={() => navigate(`/courses/lessons/${lesson.id}`)} className={style.lesson_button}>
                        <img className={style.lesson_image} width={120} height={120} src={`/icons/Plants/leafs_${lesson.lesson_order}.svg`} alt={`${lesson.lesson_order}`} />
                    </button>
                </div>
            )
        })
        return lessonsMapped
    }

    const unitsMapped = course?.units.map(unit => { //todo style this how i want it to be styled
        return (
            <div key={unit.id}>
                <h3>{unit.title}</h3>
                {LessonsMapped(unit.lessons)}
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