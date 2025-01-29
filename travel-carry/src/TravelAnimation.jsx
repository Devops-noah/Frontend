import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PiAirplaneTiltBold } from "react-icons/pi"; // Import the airplane icon
import { motion } from "framer-motion"; // For animation

const TravelAnimation = ({ paysDepart, paysDestination, dateDepart, dateArrivee }) => {
    return (
        <div className="relative w-full h-32">
            {/* Flight path line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-blue-300"></div>

            {/* Airplane animation */}
            <motion.div
                className="inline-block absolute top-1/2 transform -translate-y-1/2"
                initial={{left: "-10%"}}
                animate={{left: "90%"}}
                transition={{
                    duration: 10,
                    ease: "linear",
                    repeat: Infinity, // Infinite loop
                    repeatType: "loop", // Repeats the animation in the same direction
                }}
            >
                <PiAirplaneTiltBold
                    className="text-5xl"
                    style={{
                        fill: "url(#ethiopianGradient)", // Apply Ethiopian Airlines-inspired gradient
                    }}
                />
                <svg width="0" height="0">
                    <defs>
                        <linearGradient id="ethiopianGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#006747"/>
                            {/* Green */}
                            <stop offset="50%" stopColor="#F9E800"/>
                            {/* Yellow */}
                            <stop offset="100%" stopColor="#D01C24"/>
                            {/* Red */}
                        </linearGradient>
                    </defs>
                </svg>
            </motion.div>

            <div className="flex justify-between items-center absolute w-full top-0">
                <span className="text-lg font-bold text-black">{paysDepart}</span>
                <span className="text-lg font-bold text-black">{paysDestination}</span>
            </div>


            <div className="flex justify-between items-center absolute w-full bottom-0">
                <span className="text-sm font-bold text-black">{dateDepart}</span>
                <span className="text-sm font-bold text-black">{dateArrivee}</span>
            </div>
        </div>
    );
};
export default TravelAnimation;
