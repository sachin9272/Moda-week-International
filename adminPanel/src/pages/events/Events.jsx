import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { baseURL as API_BASE_URL } from '../../config/api';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/events/all`);
            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await axios.delete(`${API_BASE_URL}/api/events/delete/${id}`);
                setEvents(events.filter(event => event._id !== id));
            } catch (error) {
                console.error("Error deleting event:", error);
                alert("Failed to delete event");
            }
        }
    };

    return (
        <div className="p-6 min-h-screen text-black">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Events</h1>
                <Link
                    to="/events/add"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    + Add Event
                </Link>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <div key={event._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 relative">
                            <div className="absolute top-2 right-2 flex gap-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${event.eventType === 'past' ? 'bg-red-500' :
                                    event.eventType === 'global' ? 'bg-green-500' : 'bg-blue-500'
                                    } text-white`}>
                                    {event.eventType || 'upcoming'}
                                </span>
                            </div>
                            <img src={event.thumbnail?.url || event.thumbnail} alt={event.city} className="w-full h-48 object-cover" />
                            <div className="p-4">
                                <Link to={`/events/preview/${event._id}`} className="hover:underline">
                                    <h2 className="text-xl font-bold mb-2 text-white">{event.city}</h2>
                                </Link>
                                <p className="text-gray-400 mb-2">{event.eventName}</p>
                                <p className="text-gray-500 text-sm mb-4">{event.date}</p>

                                <div className="flex justify-between mt-4 border-t border-gray-700 pt-4">
                                    <Link
                                        to={`/events/edit/${event._id}`}
                                        className="text-blue-400 hover:text-blue-300 font-semibold"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(event._id)}
                                        className="text-red-400 hover:text-red-300 font-semibold"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {events.length === 0 && (
                        <p className="text-gray-400">No events found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Events;
