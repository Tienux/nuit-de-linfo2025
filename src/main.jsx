import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import PlayGame from './PlaySnacke.jsx'
import './index.css'

const BASE_NAME = "/nuit-de-linfo2025";
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter basename={BASE_NAME}>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/play" element={<PlayGame />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)
