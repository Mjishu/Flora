import { Link } from "react-router-dom";
import style from "../../styles/navbar.module.css"
import { useNavigate } from "react-router-dom";
import { UseUser } from "../user/userContext";


export default function Navbar() {
    const { currentUser, userLoading } = UseUser();
    const navigate = useNavigate();
    return (
        <div className={style.navbar}>
            <h2 onClick={() => navigate("/")}>Flora</h2>
            <Link to="/courses" className={style.navbar_link}>Learn</Link>
            <Link to="/plants" className={style.navbar_link}>Practice</Link>
            <Link to="/profile" className={style.navbar_link}>{!userLoading && currentUser ? "Profile" : "Sign Up"}</Link>
            <Link to="/login" className={style.navbar_link}>Login</Link>
        </div>
    )
}