import React from 'react'

function Reset(props) {
    return (
        <div>
            <div>
                <h2>Are you sure you want to reset your progress?</h2>
                <button onClick={props.resetProgress}>Reset</button>
                <button>Cancel</button>
            </div>
        </div>
    )
}

export default Reset