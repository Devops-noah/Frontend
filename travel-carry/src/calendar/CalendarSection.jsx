import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "tailwindcss/tailwind.css";

const localizer = momentLocalizer(moment);

function CalendarSection({ userEmail }) {
    const [events, setEvents] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:8080/api/voyages/calendar/events",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                const formattedEvents = res.data.map((event) => ({
                    title: event.summary,
                    start: new Date(event.start),
                    end: new Date(event.end),
                    htmlLink: event.htmlLink,
                }));

                setEvents(formattedEvents);
            } catch (err) {
                console.error("❌ Failed to fetch calendar events:", err);
            }
        };

        fetchEvents();
    }, [userEmail]);

    return (
        <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-2xl">
            <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
                📅 Vos Voyages TravelCarry
            </h2>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                {/* Custom Toolbar */}
                <div className="bg-blue-600 text-white text-center py-3 text-lg font-semibold tracking-wide">
                    Vue du calendrier
                </div>

                {/* Calendar */}
                <div className="p-4 sm:p-6">
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                        className="text-sm"
                        eventPropGetter={() => ({
                            style: {
                                backgroundColor: "#2563eb", // Tailwind blue-600
                                color: "white",
                                borderRadius: "0.5rem",
                                padding: "6px",
                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                            },
                        })}
                        onSelectEvent={(event) => {
                            if (event.htmlLink) {
                                window.open(event.htmlLink, "_blank");
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default CalendarSection;
