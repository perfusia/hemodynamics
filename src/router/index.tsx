import { createHashRouter, Navigate } from 'react-router-dom'
import App from '../App'
import LandingPage from '../pages/LandingPage'
import Lesson1Dashboard from '../lessons/lesson1/Lesson1Dashboard'
import Lesson2Dashboard from '../lessons/lesson2/Lesson2Dashboard'

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'lessons/1', element: <Lesson1Dashboard /> },
      { path: 'lessons/2', element: <Lesson2Dashboard /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])