import { useNavigate, } from 'react-router-dom';
const UnAuthorized = () => {
    const navigate = useNavigate()
    const handleGoBack = () => {
        navigate('/homepage');
    }
    return(
        <div>
            <h1>YOU HAVE NO PERMISSION TO ACCESS THIS PAGE</h1>
            <button onClick={handleGoBack}>GO BACK</button>
        </div>
    )
}

export default UnAuthorized