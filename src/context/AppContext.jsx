import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [creditBalance, setCreditBalance] = useState(0);
    const [token, setToken] = useState(localStorage.getItem('token'))
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const getCreditBalance = async () =>{
        console.log(token);
        if (token) {
            try {
            const {data} = await axios.get(backendUrl+'/api/user/credits',{headers:{
                token : token
            }});
            if (data.success){
            setUser(data.user);
            setCreditBalance(data.credits);
            setShowLogin(false);
            }else{
                console.log(error.message);
                toast.error(data.message)
            }
            
            console.log(data);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message)
        }
    }
    }
    const logout = async () => {
        try {
            setUser(null);
            setToken('');
            localStorage.setItem('token','');
            toast.info("You’ve been logged out.");
        } catch (error) {
            console.log(error.message);
            toast.error(error.message)
        }
    }
    useEffect(()=>{
        getCreditBalance();
    },[token]);
    const value = {
        user,setUser,showLogin,setShowLogin,creditBalance,setCreditBalance,token,setToken,backendUrl,getCreditBalance,logout
    }
    return (<AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>)
}

export default AppContextProvider;