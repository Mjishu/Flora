import React from 'react';
import style from "../styles/card.module.css"

type CardProps = {
    image: string;
    common_name: string;
    plantNumber: number;
    setPlantNumber: (value: (prevNumber: number) => number) => void;
    plantsLength: number;
    handleKnown: any;
    handleUnknown: any;
}

export function Card(props: CardProps) {

    return (
        <div>
            <h3>{props.common_name}</h3>
            {props.image && <img src={props.image} className={`${style.CardImage} shadow2`} />}
            <div className={style.buttonHolder}>
                <button className={`${style.answerButton} shadow1`} onClick={props.handleUnknown}>
                    <span className={style.answerButtonUnknown}>
                        <img className={style.buttonSvg} src="/icons/X.svg" alt="Unknown" />
                    </span>
                </button>
                <button className={`${style.answerButton} shadow1`} onClick={props.handleKnown}>
                    <span className={style.answerButtonKnown}>
                        <img className={style.buttonSvg} src="/icons/Checkmark.svg" alt="Known" />
                    </span>
                </button>
            </div>

        </div>
    )
}

export function ReverseCard(props: CardProps) {

    return (
        <div>
            <h3>{props.common_name}</h3>
            {props.image && <img src={props.image} className={`${style.CardImage} shadow2`} />}
            <div className={style.buttonHolder}>
                <button className={`${style.answerButton} shadow1`} onClick={props.handleUnknown}>
                    <span className={style.answerButtonUnknown}>
                        <img className={style.buttonSvg} src="/icons/X.svg" alt="Unknown" />
                    </span>
                </button>
                <button className={`${style.answerButton} shadow1`} onClick={props.handleKnown}>
                    <span className={style.answerButtonKnown}>
                        <img className={style.buttonSvg} src="/icons/Checkmark.svg" alt="Known" />
                    </span>
                </button>
            </div>

        </div>
    )
}