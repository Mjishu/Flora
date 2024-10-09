import Home from "./src/Home.tsx"
import PlantHome from "./src/pages/PlantHome.tsx"
import Error from "./src/components/general/Error.tsx"
import Signup from "./src/components/user/Signup.tsx"
import Login from "./src/components/user/Login.tsx"
import Profile from "./src/pages/Profile.tsx"
import Courses from "./src/components/general/Courses.tsx"

const routes = [
    {
        path: "/",
        element: <Home />,
        errorElement: <Error />
    },
    {
        path: "/plants",
        element: <PlantHome />
    },
    {
        path: "/register",
        element: <Signup />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/profile",
        element: <Profile />
    },
    {
        path: "/courses/:id",
        element: <Courses />
    }
]

export default routes