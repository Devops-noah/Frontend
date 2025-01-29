import React, { useState } from "react";
import axios from "axios";

const UpdateUserProfileImage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [message, setMessage] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        // Generate a preview URL for the selected file
        const preview = URL.createObjectURL(file);
        setPreviewUrl(preview);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            setMessage("Please select a file to upload.");
            return;
        }

        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            setIsUploading(true); // Set uploading status to true

            // Send PUT request to the backend
            const response = await axios.post("http://localhost:8080/api/utilisateurs/profile/upload-image", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            // Display success message
            setMessage("Profile image updated successfully!");
            console.log("New Image URL:", response.data);

            // Refresh the page after successful upload
            window.location.reload();
        } catch (error) {
            console.error("Error updating profile image:", error);
            setMessage("Failed to update profile image.");
        } finally {
            setIsUploading(false); // Reset uploading status
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6">
            <form onSubmit={handleSubmit} className="w-full max-w-sm bg-gray-200 shadow-md rounded px-8 pt-6 pb-8">
                <div className="mb-4">
                    <label
                        htmlFor="file"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Choose a Profile Image
                    </label>
                    <input
                        type="file"
                        id="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                    />
                </div>

                {previewUrl && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                        <img
                            src={previewUrl}
                            alt="Profile Preview"
                            className="rounded w-full h-auto max-h-40 object-cover"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
                    disabled={isUploading} // Disable the button while uploading
                >
                    {isUploading ? "Uploading..." : "Update Image"}
                </button>
            </form>

            {message && (
                <div
                    className={`mt-4 p-4 rounded text-center ${
                        message.includes("successfully")
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                    }`}
                >
                    {message}
                </div>
            )}
        </div>
    );
};

export default UpdateUserProfileImage;
