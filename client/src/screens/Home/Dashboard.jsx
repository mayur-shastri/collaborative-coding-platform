import { instance as configuredAxios } from '../../axiosConfig';
import { useContext, useEffect, useState } from "react";
import Typography from '@mui/material/Typography'
import QuizInfoCard from '../../components/QuizInfoCard/QuizInfoCard';
import MyButton from '../../components/Button/MyButton';
import { useNavigate } from 'react-router-dom';
import UserIdContext from '../../context providers/UserId/UserIdContext';

export default function Dashboard() {

    const [userData, setUserData] = useState({});

    const {userId, setUserId} = useContext(UserIdContext);

    useEffect(() => {
        const getUserData = async () => {
            const url = `${userId}/userData`;
            console.log(url);
            const userData = await configuredAxios.get(url);
            userData.data._id = userId;
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
        const quiz_id = response.data.quiz_id;
        navigate(`/${user_id}/${quiz_id}/edit`);
    }

    const joinQuiz = ()=>{
        navigate('/join');
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
                <MyButton text="Join Quiz" icon="groupAddIcon" onClick={joinQuiz}/>
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
                            const slide = quiz.slides[0];
                            return (
                                <QuizInfoCard key={index} slide={slide} title={quiz.title} lastAccessed={quiz.lastAccessed} user_id={userData._id} quiz_id={quiz._id} setUserData={setUserData}/>
                            );
                        })
                        : null
                }
            </div>
        </>
    );
}