import React from 'react';
import style from "../styles/card.module.css"

type CardProps = {
    image: string;
    common_name: string;
    plantNumber: number;
    setPlantNumber: (value: (prevNumber: number) => number) => void;
    plantsLength: number;
}

export default function Card(props: CardProps) {
    const [known, setKnown] = React.useState(false)

    function handleKnown() {
        setKnown(true)
        if (props.plantNumber >= props.plantsLength) { //!How to set plantNumber back down to 0?w
            console.log("Hit max plants")
            props.setPlantNumber((prevNumber: number) => 0)
        }
        props.setPlantNumber((prevNumber: number) => prevNumber + 1)
    }

    function handleUnknown() {
        setKnown(false)
        if (props.plantNumber >= props.plantsLength) {
            props.setPlantNumber((prevNumber: number) => 0)
        }
        //setPlantNumber((prevNumber: number) => prevNumber += 1)
    }

    return (
        <div>
            <h3>{props.common_name}</h3>
            {props.image && <img src={props.image} className={style.CardImage} />}
            <div className={style.buttonHolder}>
                <button className={`${style.answerButton} ${style.buttonKnown}`} onClick={handleKnown}>Know</button>
                <button className={`${style.answerButton} ${style.buttonUnknown}`} onClick={handleUnknown}>Don't Know</button>
            </div>

        </div>
    )
} 