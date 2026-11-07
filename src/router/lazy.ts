import { lazy } from 'react'

/** Route-level code splitting: each lesson and the model page load on demand. */
export const Lesson1 = lazy(() => import('../lessons/lesson1/Lesson1'))
export const Lesson2 = lazy(() => import('../lessons/lesson2/Lesson2'))
export const Lesson3 = lazy(() => import('../lessons/lesson3/Lesson3'))
export const Lesson4 = lazy(() => import('../lessons/lesson4/Lesson4'))
export const Lesson5 = lazy(() => import('../lessons/lesson5/Lesson5'))
export const ModelPage = lazy(() => import('../pages/ModelPage'))
