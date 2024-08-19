import { Link } from "react-router-dom";

export default function Navbar() {

    return (
        <div className="navbar">
            <Link to="/" className="navbar-link">Home</Link>
            <Link to="/profile" className="navbar-link">Profile</Link>
            <Link to="/signup" className="navbar-link">Signup</Link>
        </div>
    )
}