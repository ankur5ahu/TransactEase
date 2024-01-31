import { useEffect, useState } from "react"
import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import axios from "axios"

export const Dashboard = () => {
    const[balance,setBalance]=useState(0)

    useEffect(()=>{
        const response = axios.get("http://localhost:3000/api/v1/account/balance")
        setBalance(response.balance)
    })

    return <div>
        <Appbar />
        <div className="m-3">
            <Balance value={balance} />
            <Users />
        </div>
    </div>
}