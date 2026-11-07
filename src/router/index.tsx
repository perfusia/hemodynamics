import { Suspense, type ReactNode } from 'react'
import { createHashRouter, Navigate } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import { Lesson1, Lesson2, Lesson3, Lesson4, Lesson5, ModelPage } from './lazy'

const wait = (el: ReactNode) => (
  <Suspense fallback={<div className="mx-auto max-w-[1360px] px-[var(--gutter)] py-24 font-sans text-ink-3">Loading…</div>}>{el}</Suspense>
)

/**
 * Hash routing keeps deep links working on GitHub Pages, which has no
 * server-side rewrites. Lesson paths are unchanged from version 1.
 */
export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'lessons/1', element: wait(<Lesson1 />) },
      { path: 'lessons/2', element: wait(<Lesson2 />) },
      { path: 'lessons/3', element: wait(<Lesson3 />) },
      { path: 'lessons/4', element: wait(<Lesson4 />) },
      { path: 'lessons/5', element: wait(<Lesson5 />) },
      { path: 'model', element: wait(<ModelPage />) },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
