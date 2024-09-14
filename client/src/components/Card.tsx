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
    cardFlipped: any;
}

type reverseCardProps = {
    common_name: string;
    plantNumber: number;
    setPlantNumber: (value: (prevNumber: number) => number) => void;
    plantsLength: number;
    handleKnown: any;
    handleUnknown: any;
    genus: string;
    scientific_name: string;
    family: string;
    cardFlipped: any
}

export function Card(props: CardProps) {

    return (
        <div>
            <h3>{props.common_name}</h3>
            {props.image && <button className={style.imageButton} onClick={props.cardFlipped}>
                <img src={props.image} className={`${style.CardImage} shadow2`} />
            </button>}
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

export function ReverseCard(props: reverseCardProps) {

    return (
        <div>
            <button className={style.imageButton} onClick={props.cardFlipped}>
                <div className={`${style.reverseCard}`}>
                    <div>
                        <h4>Common Name</h4>
                        <hr />
                        <h4>{props.common_name}</h4>
                    </div>
                    <div>
                        <h5>Scientific Name</h5>
                        <hr />
                        <h5>{props.scientific_name}</h5>
                    </div>
                    <div>
                        <p>Genus</p>
                        <hr />
                        <p> {props.genus}</p>
                    </div>
                    <div>
                        <p>Family</p>
                        <hr />
                        <p>{props.family}</p>
                    </div>
                </div>
            </button>
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

        </div >
    )
}