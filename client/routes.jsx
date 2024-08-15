import Home from "./src/Home.tsx"
import Error from "./src/components/Error.tsx"

const routes = [
    {
        path: "/",
        element: <Home />,
        errorElement: <Error />
    }
]

export default routes