import { useAuth } from "../../context/UserContext"
import LeaveCreditsFormat from "../leave-history/LeaveCreditsFormat"

export default function MeDashboard(){

    const {user} = useAuth()
    return(
        <LeaveCreditsFormat selectedPersonnel={user?.personnel}/>
    )
}