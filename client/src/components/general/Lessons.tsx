import React from 'react'
import { useParams } from "react-router-dom";
import { Lessons } from '../../types';
import Navbar from './Navbar';

function useLessonInfo() {
    const [lessonInfo, setLessonInfo] = React.useState<Lessons | undefined>(undefined);
    const [lessonLoading, setLessonLoading] = React.useState<boolean>(true);
    const { id } = useParams();

    React.useEffect(() => {
        async function fetchLessonInfo() {
            try {
                const response = await fetch(`/api/courses/lessons/${id}`)
                if (!response.ok) {
                    throw new Error(`Http erro! status: ${response.status}`)
                }
                const data = await response.json()
                setLessonInfo(data);
            } catch (error) {
                console.error(`there was an error fetching lesson details: ${error}`)
            }
        }
        fetchLessonInfo();
        setLessonLoading(false);
    }, [id])
    return { lessonInfo, lessonLoading }
}

function LessonsComponent() {
    const { lessonInfo, lessonLoading } = useLessonInfo();

    React.useEffect(() => { console.log(`lesson is still loading: ${lessonLoading}`, lessonInfo) }, [lessonInfo])

    if (lessonLoading) { return <div>Loading...</div> }
    if (!lessonInfo) { return <h3>Can not find lesson data</h3> }

    return (
        <div className='content'>
            <Navbar />
            <div>
                <h1>{lessonInfo.title}</h1>
            </div>
        </div>
    )
}

export default LessonsComponent