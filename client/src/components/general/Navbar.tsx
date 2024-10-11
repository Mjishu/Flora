import { Link } from "react-router-dom";
import style from "../../styles/navbar.module.css"
import { useNavigate } from "react-router-dom";
import { UseUser } from "../user/userContext";


export default function Navbar() {
    const { currentUser, userLoading } = UseUser();
    const navigate = useNavigate();
    return (
        <div className={style.navbar}>
            <h2 className={style.title} onClick={() => navigate("/")}>Flora</h2>
            <div className={style.link_holder}>
                <Link to="/" className={style.navbar_link}>Learn</Link>
                <Link to="/review" className={style.navbar_link}>Practice</Link>
                <Link to="/profile" className={style.navbar_link}>{!userLoading && currentUser ? "Profile" : "Log In"}</Link>
                <Link to="/" className={style.navbar_link}>More</Link>
            </div>
        </div>
    )
}