import { useAuth } from './AuthContext';
import GoBackButton from './goBackBtn';

const Studentpage = () => {
    const { isAuthorized } = useAuth();
    
    return(
        isAuthorized(1) ? (
            <div>
                <h1>Welcome Student!</h1>
            </div>
        ) : (
            <div>
                <h1>YOU HAVE NO PERMISSION TO ACCESS THIS PAGE</h1>
                <GoBackButton />
            </div>
        )
    )
}

export default Studentpage