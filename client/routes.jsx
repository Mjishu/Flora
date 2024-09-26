import Home from "./src/Home.tsx"
import PlantHome from "./src/pages/PlantHome.tsx"
import Error from "./src/components/general/Error.tsx"
import Signup from "./src/components/user/Signup.tsx"
import Login from "./src/components/user/Login.tsx"
import Profile from "./src/pages/Profile.tsx"
import PlantQuiz from "./src/components/plants/PlantQuiz.tsx"

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
        path: "/quiz",
        element: <PlantQuiz /> //* Im not sure if i want this to be a page or to just call this on plantHome?
    }
]

export default routes