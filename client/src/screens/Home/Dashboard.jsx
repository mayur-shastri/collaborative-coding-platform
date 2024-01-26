import { instance as configuredAxios } from '../../axiosConfig';
import { useEffect, useState } from "react";
import Typography from '@mui/material/Typography'
import QuizInfoCard from '../../components/QuizInfoCard/QuizInfoCard';
import MyButton from '../../components/Button/MyButton';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {

    const [userData, setUserData] = useState({});
    useEffect(() => {
        const getUserData = async () => {
            const userData = await configuredAxios.get(`/userdata`);
            return userData.data;
            /* 
            The userData object looks like this:
            {
                "user": {
                    "username": "user1",
                    "email": "......",
                    "id": 1
                },
            */
        }
        getUserData().then((data) => {
            if (data) {
                setUserData(data.user);
            }
        });
    }, []);

    const navigate = useNavigate();

    const createQuiz = async ()=>{
        const user_id = userData._id;
        const response = await configuredAxios.post(`${user_id}/quizzes`);
        // response: {quiz_id: ofah3oir3ij}
        const quiz_id = response.data.quiz_id;
        navigate(`/${user_id}/${quiz_id}/edit`);
    }

    return (
        <>
            <div className="flex flex-col items-start justify-start w-full">
                <Typography variant="h3" color="initial" sx={{ margin: '2rem'}}>
                    Welcome {userData.username}!
                </Typography>
            </div>
            <div className='flex flex-row justify-start items-center m-8'>
                <MyButton text="Create Quiz" icon="plusIcon" onClick={createQuiz}/>
                <MyButton text="Join Quiz" icon="groupAddIcon" onClick={()=>{}}/>
            </div>
            <div className="flex flex-col items-start justify-start w-full ml-8">
                <Typography variant="body1" color="initial" sx={{marginBottom: '1rem', fontWeight: 'bold' }}>
                    Recently viewed
                </Typography>
            </div>
            <div className='flex flex-row'>
                {
                    userData.quizzes ?
                        // userData.quizzes.map((quiz,index) => {
                        //     return (
                        //         <QuizInfoCard key={index} imageUrl="https://www.softmaker.com/images/smo/presentations/presentations_windows_en.png" title={quiz.title} lastAccessed={quiz.lastAccessed} />
                        //     );
                        // })
                        userData.quizzes.slice(0, 3).map((quiz, index) => {
                            return (
                                <QuizInfoCard key={index} imageUrl="https://www.softmaker.com/images/smo/presentations/presentations_windows_en.png" title={quiz.title} lastAccessed={quiz.lastAccessed} user_id={userData._id} quiz_id={quiz._id} setUserData={setUserData}/>
                            );
                        })
                        : null
                }
            </div>
        </>
    );
}