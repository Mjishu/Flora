import { Link } from "react-router-dom"

export default function Error() {

    return (
        <div>
            <h1>This page does not exist</h1>
            <Link to="/">Home</Link>
        </div>
    )
}