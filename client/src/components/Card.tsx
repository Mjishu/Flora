import React from 'react';
import style from "../styles/card.module.css"

export default function Card(props: { image: string, common_name: string; }) {
    const [known, setKnown] = React.useState(false)

    function handleKnown() {
        setKnown(true)
    }

    function handleUnknown() {
        setKnown(false)
    }

    return (
        <div>
            <h3>{props.common_name}</h3>
            {props.image && <img src={props.image} className={style.CardImage} />}
            <div className={style.buttonHolder}>
                <button className={`${style.answerButton} ${style.buttonKnown}`} onClick={handleKnown}>Know</button>
                <button className={`${style.answerButton} ${style.buttonUnknown}`} onClick={handleUnknown}>Don't Know</button>
            </div>
            <p>The current card is {known ? "Known" : "Unknown"}</p>
        </div>
    )
} 