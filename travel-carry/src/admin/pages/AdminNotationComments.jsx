import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminNotationComments() {
    const [allComments, setAllComments] = useState([]);

    const token = localStorage.getItem("token");
    // Fetch all comments on component mount
    useEffect(() => {
        axios
            .get("http://localhost:8080/api/admin/notations/get-notations", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                console.log("Response Notation:", JSON.stringify(response.data));
                setAllComments(response.data);
            })
            .catch((error) => {
                console.error("Error fetching comments:", error);
            });
    }, []);

    // Handle approval of a comment
    const handleApprove = (id) => {
        console.log("Approving ID:", id); // Debugging log
        axios
            .put(
                `http://localhost:8080/api/admin/notations/approve/${id}`,
                null, // No body content
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            .then(() => {
                setAllComments((prev) =>
                    prev.map((comment) =>
                        comment.id === id ? { ...comment, status: "APPROVED" } : comment
                    )
                );
            })
            .catch((error) => {
                console.error("Error approving comment:", error);
            });
    };

    // Handle suspension of a comment
    const handleSuspend = (id) => {
        axios
            .put(`http://localhost:8080/api/admin/notations/suspend/${id}`, null,{
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                setAllComments((prev) =>
                    prev.map((comment) =>
                        comment.id === id ? { ...comment, status: "SUSPENDED" } : comment
                    )
                );
            })
            .catch((error) => {
                console.error("Error suspending comment:", error);
            });
    };
console.log("all comments: " + JSON.stringify(allComments))
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Notation Comments</h1>
            {allComments.length === 0 ? (
                <p>No comments available</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left">User</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Note</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Comment</th>
                            <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                            <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {allComments.map((comment) => (
                            <tr
                                key={comment.id}
                                className={`${
                                    comment.status === "APPROVED"
                                        ? "bg-green-50"
                                        : comment.status === "SUSPENDED"
                                            ? "bg-red-50"
                                            : "bg-yellow-50"
                                }`}
                            >
                                <td className="border border-gray-300 px-4 py-2">
                                    {comment.userFirstName} {comment.userName}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">{comment.note}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {comment.commentaire}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    {comment.status === "PENDING" ? (
                                        <span className="text-yellow-600">Pending</span>
                                    ) : (
                                        comment.status
                                    )}
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    <div className="flex justify-center space-x-2">
                                        {comment.status !== "APPROVED" && (
                                            <button
                                                onClick={() => handleApprove(comment.id)}
                                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {comment.status !== "SUSPENDED" && (
                                            <button
                                                onClick={() => handleSuspend(comment.id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Suspend
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
