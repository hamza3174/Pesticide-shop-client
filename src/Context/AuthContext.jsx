import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import axios from "axios";

export const AuthContext = createContext();



const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [logoutLoading, setLogoutLoading] =
        useState(false);

    useEffect(() => {

        const checkAuth = async () => {

            const token =
                localStorage.getItem("token");

            // No token
            if (!token) {

                setLoading(false);

                return;
            }

            try {

                const res = await axios.get(
                    `${window.api}/verify-token`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (res.data?.valid) {

                    setUser({
                        token,
                        ...res.data.user
                    });

                } else {

                    localStorage.removeItem("token");

                    setUser(null);

                }

            } catch (error) {

                console.log(
                    "AUTH ERROR:",
                    error.response?.status
                );

                if (
                    error.response?.status === 401
                ) {

                    localStorage.removeItem("token");

                    setUser(null);

                }

            } finally {

                setLoading(false);

            }
        };

        checkAuth();

    }, []);

    // LOGIN

    const login = (
        token,
        userData
    ) => {

        localStorage.setItem(
            "token",
            token
        );

        setUser({
            token,
            ...userData
        });

    };

    // LOGOUT

    const logout = () => {

        setLogoutLoading(true);

        setTimeout(() => {

            localStorage.removeItem(
                "token"
            );

            setUser(null);

            setLogoutLoading(false);

        }, 2000);

    };

    return (

        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading,
                setLoading,
                logoutLoading
            }}
        >

            {children}

        </AuthContext.Provider>

    );
};

export default AuthProvider;

export const useAuthContext = () =>
    useContext(AuthContext);