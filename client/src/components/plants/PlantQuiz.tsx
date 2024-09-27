import React from 'react'
import { UseUser } from "../user/userContext"
import style from "../../styles/quiz.module.css"
import Navbar from '../general/Navbar'

interface answers {
    id: string;
    quiz_id: string;
    answer: string;
    is_correct: boolean;
    created_at: Date;
    selected: boolean | undefined;
}

interface quiz {
    id: string;
    user_id: string;
    quiz_id: string,
    created_at: Date;
    completed_at: Date | null;
    progress: string;
    score: number;
}

interface User {
    username: string;
    email: string;
    id: string;
    zone: string
}

function useData(url: string, quiz_id: string, currentUser: User) {
    const [data, setData] = React.useState<answers[] | undefined>(undefined)
    const [quiz, setQuiz] = React.useState<quiz | undefined>(undefined)
    const [loading, setLoading] = React.useState(true)


    React.useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) { return console.error("Could not fetch token") }

        const params = {
            method: "POST", headers: { Authorization: token, "Content-Type": "application/json" }, body: JSON.stringify({ user_id: currentUser?.id, quiz_id: quiz_id })
        }

        fetch(url, params)
            .then(res => res.json())
            .then(data => {
                setData(data.answers)
                setQuiz(data.user_quiz[0])
            })
            .catch(err => console.error(`error fetching ${url}: ${err}`))
            .finally(() => setLoading(false))
    }, [])
    return { data, quiz, loading }
}

function PlantQuiz() {
    const { currentUser, userLoading } = UseUser(); //* why is quiz unknow here
    const { data: quizAnswers, quiz, loading } = useData("/api/quiz/details", "ee404454-b115-4c5e-b907-1899f6207f41", currentUser)
    const [selected, setSelected] = React.useState<string[]>([]);



    if (loading || userLoading) {
        return <h1>Loading...</h1>
    }
    if (!loading && !quizAnswers || !quiz) {
        return <h1>Couldn't find quiz </h1>
    }

    function handleDetailClick(answer: answers) {
        if (selected.includes(answer.id)) {
            setSelected(prevSelected => prevSelected.filter(id => id !== answer.id))
            return
        }
        setSelected(prevSelected => [...prevSelected, answer.id])
    }

    const mappedAnswers = quizAnswers?.map((answer: answers) => {//* instead of is_correct -> selected //! should this go into a useEffect?
        const is_selected = selected.includes(answer.id)
        return (
            < button key={answer.id} className={`${style.quiz_detail_buttons} ${is_selected && style.detail_button_selected}`} onClick={() => handleDetailClick(answer)}>
                <h5> {answer.answer}</h5>
            </button >
        )
    });

    function arraysEqual(arr1: string[] | undefined, arr2: string[]) {
        if (arr1?.length !== arr2.length) { return false }
        for (let i = 0; i < selected.length; i++) {
            if (arr1.sort()[i] !== arr2.sort()[i]) { return false }
        }
        return true
    }

    function handleSubmit() {
        if (!quiz) { return console.error("cannot find quiz") }
        const token = localStorage.getItem("token")
        if (!token) { return console.error("Cannot find login token") }
        const correctAnswers = quizAnswers?.filter(answer => answer.is_correct === true).map(answer => answer.id)

        const arrEquals = arraysEqual(correctAnswers, selected)

        if (arrEquals) {
            console.log("You got it correct")
            fetch(`/api/quiz/details/${quiz.quiz_id}/update`, { headers: { Authorization: token } })
                .then(res => res.json())
                .then(data => console.log(data))
                .catch(err => console.error(`there was an error updating quiz data: ${err}`))
        } else {
            console.log("Incorrect try again!")
            return
        }
    }

    return (
        <div className={style.content}>
            <Navbar />
            <h1>Plant Quiz</h1>
            <div className={style.mapped_answer_holder}>
                {mappedAnswers}
            </div>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export default PlantQuiz