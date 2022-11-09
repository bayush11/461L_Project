import React from "react";
import './App.css';
import Projects from "./projects";
import NewUser from "./create_user";
import NewProject from "./create_project";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from "./Layout";
import Login from "./login"

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Layout />}>
                    {/* <Route index element={Home page} */}
                    <Route path="/login" element={<Login />} />
                    <Route path="projects" element={<Projects />} />
                    <Route path="newUser" element={<NewUser />} />
                    <Route path="projects/newProject" element={<NewProject />} />
                    {/* <Route path='*' element={<PageNotFound />} */}
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App