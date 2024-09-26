import React from 'react'
import { UseUser } from "../user/userContext"
import style from "../../styles/quiz.module.css"

interface answers {
    id: string;
    quiz_id: string;
    answer: string;
    is_correct: false;
    created_at: Date;
    selected: boolean | undefined;
}

interface User {
    username: string;
    email: string;
    id: string;
    zone: string
}

function useData(url: string, quiz_id: string, currentUser: User) {
    const [data, setData] = React.useState<answers[] | undefined>(undefined)
    const [quiz, setQuiz] = React.useState(undefined)
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
                setQuiz(data.user_quiz)
            })
            .catch(err => console.error(`error fetching ${url}: ${err}`))
            .finally(() => setLoading(false))
    }, [])
    return { data, quiz, loading }
}

function PlantQuiz() {
    const { currentUser, userLoading } = UseUser(); //* why is quiz unknow here
    const { data: quizAnswers, quiz, loading } = useData("/api/quiz/details", "ee404454-b115-4c5e-b907-1899f6207f41", currentUser)
    const [mappedAnswers, setMappedAnswers] = React.useState<answers[]>([])

    React.useEffect(() => {
        if (quizAnswers) {
            const initiliazedAnswers = quizAnswers.map(answer => ({
                ...answer, selected: false
            }));
            setMappedAnswers(initiliazedAnswers);
        }
    }, [quizAnswers])

    if (loading || userLoading) {
        return <h1>Loading...</h1>
    }
    if (!loading && !quizAnswers) {
        return <h1>Couldn't find quiz </h1>
    }

    function handleDetailClick(answer: answers) {
        const updatedAnswers = mappedAnswers.map(mapAnswer => mapAnswer.id === answer.id ? { ...answer, selected: !answer.selected } : answer);
        setMappedAnswers(updatedAnswers);
    }

    const renderedAnswers = mappedAnswers.map((answer: answers) => {//* On button click it should give this the class of either correct or incorrect button
        answer.selected = false;
        return (
            < button key={answer.id} className={`${style.quiz_detail_buttons} ${answer.selected && style.detail_button_selected}`} onClick={() => handleDetailClick(answer)}>
                <h5> {answer.answer}</h5>
            </button >
        )
    });

    function handleSubmit() {
        console.log("You submitted!")
    }

    return (
        <div className={style.content}>
            <h1>Plant Quiz</h1>
            <div className={style.mapped_answer_holder}>
                {renderedAnswers}
            </div>
            <button onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export default PlantQuiz