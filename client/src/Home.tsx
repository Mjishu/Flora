import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import style from "./styles/homePage.module.css"
import { UseUser } from "./components/user/userContext";
import authService from './auth/authService';
import Navbar from './components/general/Navbar';

const AuthService = new authService();

interface Courses {
    id: string;
    title: string;
    image_src: string | null;
}

function useCourses() {
    const [courses, setCourses] = React.useState<Courses[] | undefined>(undefined);
    const [coursesLoading, setCoursesLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        try {
            fetch("/api/courses/all").then(res => res.json())
                .then(data => setCourses(data))
                .catch(err => console.error(`there was an error fetching the courses: ${err}`))
                .finally(() => setCoursesLoading(false))
        } catch (err) {
            console.error(`there was an error fetching courses: ${err}`)
        }
    }, [])
    return { courses, coursesLoading }
}

function Home() {
    const { currentUser, userLoading } = UseUser();
    const { courses, coursesLoading } = useCourses();
    const [displayUser, setDisplayUser] = React.useState({ username: "", show: false });
    const navigate = useNavigate();

    if (userLoading || coursesLoading) {
        return <h1>App is loadiSng</h1>
    }

    function checkSignedIn() {
        setDisplayUser(prevDisplay => ({ ...prevDisplay, username: currentUser?.username ?? "", show: !prevDisplay.show }))
    }

    const coursesMapped = courses?.map(course => {
        return <div key={course.id}>
            <button className={`${style.kingdomButton} fs-24`} onClick={() => navigate(`/courses/${course.id}`)}>{course.title}</button>
        </div>
    })

    return (
        <div className='content'>
            <Navbar />
            <div>
                <p>Welcome to flora</p>
                <button onClick={checkSignedIn}>Check logged in status</button>
                <button onClick={() => AuthService.logout()}>Logout</button>
                {displayUser.show && <h2>Your username is {displayUser.username}</h2>}

                <div className={style.kingdomHolder}>
                    {/* <button className={`${style.kingdomButton} fs-24`} onClick={() => navigate("/courses")}>Flora</button>
                    <button className={`${style.kingdomButton} fs-24`}>Fauna</button>
                    <button className={`${style.kingdomButton} fs-24`}>Fungi</button>` */}
                    {coursesMapped}
                </div>
            </div>
        </div>
    )
}

export default Home