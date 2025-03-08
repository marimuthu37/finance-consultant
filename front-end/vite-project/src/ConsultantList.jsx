import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const ConsultantPage = () => {
    const [consultants, setConsultants] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:7000/consultant/list")
            .then(response => setConsultants(response.data))
            .catch(error => console.error("Error fetching consultants:", error));
    }, []);

    const handleRequest = (consultantId) => {
        const userId = 1;

        axios.post("http://localhost:7000/request/add/consultant-request", { user_id: userId, consultant_id: consultantId })
            .then(response => {
                alert("Consultant request sent successfully!");
            })
            .catch(error => {
                alert(error.response?.data?.error || "Something went wrong");
            });
    };

    return (
        <div className="bg-white min-h-screen py-12">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Our Expert Consultants</h1>
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
                {consultants.length > 0 ? (
                    consultants.map((consultant, index) => (
                        <motion.div
                            key={consultant.id}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-100 rounded-xl shadow-md p-6 text-center flex flex-col items-center hover:shadow-lg transition"
                        >
                            {/* Profile Image */}
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 shadow-sm">
                                <img
                                    src={`https://i.pravatar.cc/150?img=${index + 10}`} 
                                    alt="Consultant"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Consultant Info */}
                            <h3 className="text-xl font-semibold text-gray-900 mt-4">{consultant.name}</h3>
                            <p className="text-gray-600 text-sm">{consultant.experience} years of experience</p>

                            {/* Type Badge */}
                            <span className="mt-3 text-sm font-medium text-white bg-gray-700 px-4 py-1 rounded-full">
                                {consultant.type}
                            </span>

                            {/* Contact Button */}
                            <button
                                onClick={() => handleRequest(consultant.id)}
                                className="mt-4 bg-gray-700 hover:bg-gray-900 text-white px-5 py-2 rounded-lg shadow-sm transition"
                            >
                                Take Consultant
                            </button>
                        </motion.div>
                    ))
                ) : (
                    <p className="text-center text-gray-600 text-lg col-span-3">No consultants available.</p>
                )}
            </div>
        </div>
    );
};

export default ConsultantPage;
