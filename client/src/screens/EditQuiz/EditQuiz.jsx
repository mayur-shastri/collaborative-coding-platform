import { useParams } from 'react-router-dom';
import CustomizationPanel from './CustomizationPanel/CustomizationPanel';
import SlidesBar from './SlidesBar/SlidesBar';
import SlidePreview from './SlidePreview/SlidePreview';
import Toolsbar from './Appbar/Toolsbar';
import { useContext, useEffect, useRef, useState } from 'react';
import QuizContext from './Context Provider/QuizContext';
import { instance as configuredAxios } from '../../axiosConfig';

export default function EditQuiz() {

    const { user_id, quiz_id } = useParams();

    const { slides, setSlides, activeSlideId } = useContext(QuizContext);

    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [quizName, setQuizName] = useState("");

    const slidesRef = useRef(null);
    
    useEffect(()=>{
        slidesRef.current = slides;
    }, [slides]);

    const saveTimeoutRef = useRef(null);

    const getSlides = async () => {
        try {
            const response = await configuredAxios.get(`${user_id}/${quiz_id}/slides`);
            return response.data.slides;
        } catch(e){
            console.log(e);
        }
    }

    useEffect(()=>{
        console.log(isSaving);
    }, [isSaving]);

    useEffect(()=>{
        try{
            if(quizName === ""){
                return;
            }
            const res = configuredAxios.patch(`/${quiz_id}/name`, {newName: quizName});
            console.log(res.data.message);
        } catch(e){
            console.log(e);
        }
    }, [quizName]);

    const saveSlides = async (slidesRefCurrent) => {
        setIsEditing(false);
        setIsSaving(true);
        try{
        const response = await configuredAxios.put(`${user_id}/${quiz_id}/slides`, { slides: slidesRefCurrent });
        return response.data.message;
        } catch(e){
            console.log(e);
        } finally{
            setTimeout(()=>{setIsSaving(false)}, 1000);
        }
    }

    useEffect(() => {
        getSlides().then((fetchedSlides) => {
            setSlides(fetchedSlides);
        });
    }, []);

    const handleUserActivity = ()=>{
        setIsEditing(true);
        if(saveTimeoutRef.current){
            clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(()=>{
            saveSlides(slidesRef.current).then((message)=>{
                console.log(message);
            });
        }, 2000);
    }

    useEffect(() => {
        window.addEventListener('click', handleUserActivity);
        window.addEventListener('keydown', handleUserActivity);
        return ()=>{
            window.removeEventListener('click', handleUserActivity);
            window.removeEventListener('keydown', handleUserActivity);
        }
    }, []); // for autosave

    return (
        <div className='flex flex-col justify-center items-center w-full h-screen'
            style={{ maxWidth: '100%' }}
        >
            <Toolsbar isEditing={isEditing} setQuizName={setQuizName} quizName={quizName} isSaving={isSaving} user_id={user_id} quiz_id={quiz_id}/>
            <div className='flex flex-row flex-grow w-full h-full'>
                <SlidesBar />
                {
                    slides.length === 0 || !activeSlideId ?
                        <div className='p-2 w-full'>
                            <div className="flex flex-col flex-grow justify-center items-center border border-black m-7 mt-1 mb-1 rounded-2xl h-full">
                                <div className='font-bold text-2xl'>Add a new slide</div>
                                <div className='font-bold text-2xl'>Or</div>
                                <div className='font-bold text-2xl'>Select an existing slide</div>
                            </div>
                        </div>
                        :
                        slides.map((slide, index) => {
                            return activeSlideId === slide.id ?
                                <div key={index} className='flex flex-row flex-grow w-full' >
                                    <SlidePreview slide={slide} />
                                    <CustomizationPanel user_id={user_id} slide={slide} />
                                </div>
                                : null
                        })
                }
            </div>
        </div>
    );
}