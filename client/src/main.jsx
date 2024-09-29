import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Dashboard from './screens/Home/Dashboard.jsx'
import Quizzes from './screens/Quizzes.jsx'
import Help from './screens/Help.jsx'
import Feedback from './screens/Feedback.jsx'
import Layout from './Layout.jsx'
import theme from './theme'
import { ThemeProvider } from '@mui/material/styles'
import Landing from './screens/LandingPage/Landing.jsx'
import Login from './screens/Authentication/Login.jsx'
import Register from './screens/Authentication/Register.jsx'
import EditQuiz from './screens/EditQuiz/EditQuiz.jsx'
import ProtectedRoutes from './Utilities/ProtectedRoutes.jsx'
import QuizProvider from './screens/EditQuiz/Context Provider/QuizProvider.jsx'
import FlashProvider from './context providers/Flash/FlashProvider.jsx'
import EnterCode from './screens/Join Quiz/EnterCode.jsx'
import ParticipantScreen from './screens/Presentation/Participant/ParticipantScreen.jsx'
import WaitingPage from './screens/Presentation/Participant/WaitingPage.jsx'
import PresenterScreen from './screens/Presentation/Creator/PresenterScreen.jsx'
import WaitingPagePresenter from './screens/Presentation/Creator/WaitingPagePresenter.jsx'
import RealTimeDataProvider from './context providers/RealTimeData (presenter)/RealTimeDataProvider.jsx'
import RealTimeParticipantDataProvider from './context providers/RealTimeData (participant)/RealTimeParticipantDataProvider.jsx'
import QuizScreen from './screens/Presentation/Participant/QuizScreen.jsx'
import PresentModeScreen from './screens/Presentation/Creator/PresentModeScreens/PresentModeScreen.jsx'
import PresentationEnded from './screens/Presentation/Participant/PresentationEnded.jsx'
import Participations from './screens/Participations/Participations.jsx'
import ResultScreen from './screens/Participations/ResultScreen.jsx'
import UserIdProvider from './context providers/UserId/UserIdContextProvider.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Landing />} />
      <Route path='end' element={
        <PresentationEnded />
      }></Route>
      <Route path='/login' element={
        <FlashProvider>
          <Login />
        </FlashProvider>
      } />
      <Route path='/:quiz_session_id/result' element={
        <ResultScreen />
      }></Route>
      <Route path='/register' element={
        <FlashProvider>
          <Register />
        </FlashProvider>
      } />
      <Route path='/:user_id/:quiz_id/edit' element={
        <ProtectedRoutes>
          <QuizProvider>
            <EditQuiz />
          </QuizProvider>
        </ProtectedRoutes>
      } />

      <Route path='/app' element={
        <FlashProvider>
          <Layout />
        </FlashProvider>}>
        <Route path='home' element={<Dashboard />}></Route>
        <Route path='quizzes' element={<Quizzes />}></Route>
        <Route path='help' element={<Help />}></Route>
        <Route path='feedback' element={<Feedback />} ></Route>
        <Route path='participations' element={<Participations />}></Route>
      </Route>
      <Route path='join' element={
        <ProtectedRoutes>
          <EnterCode />
        </ProtectedRoutes>
      }></Route>
      <Route path='participant' element={
        <RealTimeParticipantDataProvider>
          <ParticipantScreen />
        </RealTimeParticipantDataProvider>
      }>
        <Route path='waiting' element={
          <WaitingPage />
        }></Route>
        <Route path='presentation' element={
          <QuizScreen />
        }></Route>
      </Route>
      <Route path='presenter' element={
        <QuizProvider>
          <RealTimeDataProvider>
            <PresenterScreen />
          </RealTimeDataProvider>
        </QuizProvider>
      }>
        <Route path='waiting' element={
          <WaitingPagePresenter />
        }></Route>
        <Route path='presentation' element={
          <PresentModeScreen />
        }></Route>
      </Route>
    </>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <ThemeProvider theme={theme}>
    <UserIdProvider>
    <RouterProvider router={router} />
    </UserIdProvider>
  </ThemeProvider>
  // </React.StrictMode>,
)