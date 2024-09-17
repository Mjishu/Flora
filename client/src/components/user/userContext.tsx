import React from "react";

interface User {
    id: string;
    username: string;
    email: string;
}

interface UserContextType {
    currentUser: User | null;
    currentUserRef: React.MutableRefObject<User | null>;
    setCurrentUser: (user: User | null) => void;
    userLoading: boolean;
}

const UserContext = React.createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
    const [currentUser, setCurrentUser] = React.useState<User | null>(null);
    const [userLoading, setUserLoading] = React.useState(true);
    const currentUserRef = React.useRef<User | null>(null);

    React.useEffect(() => {
        const token = localStorage.getItem("token");
        if (token == null) {
            console.error("token does not exist");
            return;
        }
        const fetchParams = {
            method: "GET",
            headers: {
                Authorization: token
            }
        }
        fetch("/api/users/protected", fetchParams)
            .then(res => res.json())
            .then(data => {
                data.sucess && console.log(`user is logged in`)
                data.success && setCurrentUser(data.user);//! Change this in the userController on backend
                setUserLoading(false);
            })
            .catch(err => console.error(`Error fetching protected route ${err}`))
    }, [])

    const memoizedCurrentUser = React.useMemo(() => currentUser, [currentUser]);

    const contextValue = React.useMemo(() => ({
        currentUser: memoizedCurrentUser,
        currentUserRef,
        setCurrentUser: (user: User | null) => {
            setCurrentUser(user)
            currentUserRef.current = user;
        }, userLoading
    }), [memoizedCurrentUser, userLoading])

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
}

export function UseUser() {
    const context = React.useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be with a userProvider")
    }
    return context;
}