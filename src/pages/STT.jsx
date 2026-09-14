import React from "react";
import Transition from "../components/PageTransition.jsx";
import Header from "../components/Header.jsx";
import { useNavigate } from "react-router-dom";

export default function STT(){
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate('/');
    }
}