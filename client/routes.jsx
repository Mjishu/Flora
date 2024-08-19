import Home from "./src/Home.tsx"
import Error from "./src/components/Error.tsx"
import Signup from "./src/components/user/Signup.tsx"
import Login from "./src/components/user/Login.tsx"

const routes = [
    {
        path: "/",
        element: <Home />,
        errorElement: <Error />
    },
    {
        path: "/signup",
        element: <Signup />
    },
    {
        path: "/login",
        element: <Login />
    }
]

export default routes