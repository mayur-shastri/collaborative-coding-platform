import React, { useContext, useEffect, useRef, useState } from 'react'
import SlideView from './SlideView';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import IconButton from '@mui/material/IconButton'
import RealTimeDataContext from '../../../../context providers/RealTimeData (presenter)/RealTimeDataContext';
import { FormControlLabel, Switch, Button, appBarClasses } from '@mui/material';
import LeaderboardSlide from './LeaderboardSlide';
import { instance as configuredAxios } from '../../../../axiosConfig';
import ResultsChart from './ResultsChart';
import { useNavigate } from 'react-router-dom';

function invertColor(rgbColor) {
    const colorParts = rgbColor.match(/\d+/g);
    const invertedColorParts = colorParts.map(part => 255 - parseInt(part));
    const invertedColor = `rgb(${invertedColorParts.join(", ")})`;
    return invertedColor;
}

function PresentModeScreen() {

    const [showControls, setShowControls] = useState(true);
    const { currentSlideNumber, setCurrentSlideNumber,
        ws, currentSlideData, slidesLength, quizSessionId } = useContext(RealTimeDataContext);
    const [style, setStyle] = useState({ width: '180px', });
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState(null);
    const [isEnabled, setIsEnabled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setCurrentSlideNumber(0);
    }, []);

    useEffect(() => {
        console.log("Color badlo chalo");
        setStyle((currentStyle) => {
            return {
                ...currentStyle,
                color: invertColor(currentSlideData?.backgroundColor),
            };
        });
    }, [currentSlideData]);

    useEffect(() => {
        document.addEventListener('keydown', function (e) {
            if (e.key === 'f' || e.key === 'F') {
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) { // Firefox
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
                    document.documentElement.webkitRequestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
                    document.documentElement.msRequestFullscreen();
                }
            }
        });
    }, []);

    const prev = () => {
        setShowResults(false);
        setIsEnabled(false);
        setCurrentSlideNumber((currentNumber) => {
            if (currentNumber === 0) {
                ws.send(JSON.stringify({ method: "slideChange", currentSlideNumber: currentSlideNumber }));
                return currentNumber;
            }
            ws.send(JSON.stringify({ method: "slideChange", currentSlideNumber: currentSlideNumber - 1 }));
            return currentNumber - 1;
        });
    }

    const next = () => {
        setShowResults(false);
        setIsEnabled(false);
        setCurrentSlideNumber((currentNumber) => {
            console.log("Length: ", slidesLength);
            if (currentNumber === slidesLength - 1) {
                ws.send(JSON.stringify({ method: "slideChange", currentSlideNumber: currentSlideNumber }));
                return currentNumber;
            }
            ws.send(JSON.stringify({ method: "slideChange", currentSlideNumber: currentSlideNumber + 1 }));
            return currentNumber + 1;
        });
    }

    const toggleResults = async () => {
        if (showResults === false) {
            const results = await configuredAxios.get(`/${quizSessionId}/${currentSlideData?._id}/results`);
            setResults(results.data);
        }
        setShowResults((currentShowResults)=>{
            return !currentShowResults;
        })
    }

    const toggleResponses = () => {
        if (isEnabled) {
            ws.send(JSON.stringify({ method: "stopResponses", currentSlideNumber: currentSlideNumber }));
        } else {
            ws.send(JSON.stringify({ method: "takeResponses", currentSlideNumber: currentSlideNumber }));
        }
        setIsEnabled((currentIsEnabled)=>{
            return !currentIsEnabled;
        });
    }

    const endPresentation = ()=>{
        ws.send(JSON.stringify({method: "endPresentation"}));
        navigate('/app/home');
    }

    return (
        <div className='flex flex-row w-100 h-screen'>
            {
                currentSlideData?.selectedSlideType !== "Leaderboard" ?
                    <SlideView slide={currentSlideData} />
                    : <LeaderboardSlide />
            }
            {showControls && (
                <>
                    <IconButton aria-label="" onClick={prev}
                        sx={{
                            transition: 'opacity 0.5s ease-out',
                            '&:hover': {
                                opacity: 1
                            }
                            ,
                            position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)'
                        }}>
                        <ArrowBackIosIcon />
                    </IconButton>
                    <IconButton aria-label="" onClick={next}
                        sx={{
                            transition: 'opacity 0.5s ease-out',
                            '&:hover': {
                                opacity: 1
                            },
                            position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)'
                        }}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                    <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
                        <div>
                            <FormControlLabel
                                sx={style}
                                control={
                                    <Switch
                                        checked={isEnabled}
                                        onChange={toggleResponses}
                                    />
                                }
                                label={isEnabled ? "Disable" : "Enable"}
                            />
                            <FormControlLabel
                                sx={style}
                                control={
                                    <Switch
                                        checked={showResults}
                                        onChange={toggleResults}
                                    />
                                }
                                label={showResults ? "Hide Results" : "Show Results"}
                            />
                        </div>
                        <Button variant="outlined" 
                        sx={style}
                        onClick={endPresentation}>
                            End Presentation
                        </Button>
                    </div>
                    {
                        showResults ?
                            <div
                                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                            >
                                <ResultsChart results={results} />
                            </div>
                            : null
                    }
                </>
            )}
        </div>
    );
}

export default PresentModeScreen;