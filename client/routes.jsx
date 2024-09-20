import Home from "./src/Home.tsx"
import PlantHome from "./src/components/pages/PlantHome.tsx"
import Error from "./src/components/general/Error.tsx"
import Signup from "./src/components/user/Signup.tsx"
import Login from "./src/components/user/Login.tsx"

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
    }
]

export default routes