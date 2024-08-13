import React from 'react';
import style from "../styles/card.module.css"

export default function Card(props: { image: string, cardName: string; description: string }) {
    const [known, setKnown] = React.useState(false)

    function handleKnown() {
        setKnown(true)
    }

    function handleUnknown() {
        setKnown(false)
    }

    return (
        <div>
            {props.image && <img src={props.image} className='CardImage' />}
            <h3>{props.cardName}</h3>
            <p>{props.description}</p>
            <div className={style.buttonHolder}>
                <button className={`${style.answerButton} ${style.buttonKnown}`} onClick={handleKnown}>Know</button>
                <button className={`${style.answerButton} ${style.buttonUnknown}`} onClick={handleUnknown}>Don't Know</button>
            </div>
            <p>The current card is {known ? "Known" : "Unknown"}</p>
        </div>
    )
}