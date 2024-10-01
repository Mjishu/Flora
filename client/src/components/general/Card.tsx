import React from 'react';
import style from "../../styles/card.module.css"

type CardProps = {
    image: string;
    common_name: string;
    handleKnown: () => Promise<void>;
    handleUnknown: () => Promise<void>;
    cardFlipped: () => void;
    cardDirection: string | undefined;
}

type reverseCardProps = {
    common_name: string;
    handleKnown: () => Promise<void>;
    handleUnknown: () => Promise<void>;
    genus: string;
    scientific_name: string;
    family: string;
    cardFlipped: () => void;
    description: string;
    is_invasive: boolean;
    cardDirection: string | undefined;
}

export function Card(props: CardProps) {
    return (
        <div className={`${style.card_holder} ${props.cardDirection ? style[props.cardDirection] : ""}`}>
            <h3>{props.common_name}</h3>
            {props.image && <button tabIndex={0} className={style.imageButton} onClick={props.cardFlipped}>
                <img src={props.image} className={`${style.CardImage} shadow2`} />
                {/* {props.is_invasive && <div className={style.invasiveHolder}>
                    <p className={style.isInvasive}>Invasive</p>
                </div>} */}
            </button>}
            <div className={style.buttonHolder}>
                <button tabIndex={0} className={`${style.answerButton} shadow1`} onClick={() => props.handleUnknown()} >
                    <span className={style.answerButtonUnknown}>
                        <img className={style.buttonSvg} src="/icons/X.svg" alt="Unknown" />
                    </span>
                </button>
                <button tabIndex={0} className={`${style.answerButton} shadow1`} onClick={() => props.handleKnown()}>
                    <span className={style.ansswerButtonKnown}>
                        <img className={style.buttonSvg} src="/icons/Checkmark.svg" alt="Known" />
                    </span>
                </button>
            </div>

        </div>
    )
}

export function ReverseCard(props: reverseCardProps) {

    return (
        <div className={style.card_holder}>
            <button className={style.imageButton} onClick={props.cardFlipped} tabIndex={0}>
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
                    <p>{props.description}</p>
                    {props.is_invasive && <h6>Invasive</h6>}
                </div>
            </button>
            <div className={style.buttonHolder}>
                <button className={`${style.answerButton} shadow1`} onClick={async () => await props.handleUnknown}>
                    <span className={style.answerButtonUnknown}>
                        <img className={style.buttonSvg} src="/icons/X.svg" alt="Unknown" />
                    </span>
                </button>
                <button className={`${style.answerButton} shadow1`} onClick={async () => await props.handleKnown}>
                    <span className={style.answerButtonKnown}>
                        <img className={style.buttonSvg} src="/icons/Checkmark.svg" alt="Known" />
                    </span>
                </button>
            </div>

        </div >
    )
}