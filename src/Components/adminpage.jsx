import { useAuth } from './AuthContext';
import GoBackButton from './goBackBtn';
const Adminpage = () => {
    const { isAuthorized } = useAuth();
    
    return(
        isAuthorized(4) ? (
            <div>
                <h1>Welcome Admin!</h1>
            </div>
        ) : (
            <div>
                <h1>YOU HAVE NO PERMISSION TO ACCESS THIS PAGE</h1>
                <GoBackButton />
            </div>
        )
    )
}

export default Adminpage