import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        motDePasse: "",
    });
    const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Check if user is already logged in
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/"); // Redirect to home or dashboard if already logged in
        }
    }, [navigate]);

    // Handle input changes in the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const response = await axios.post(
                "http://localhost:8080/api/auth/login",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("response data from login: " + JSON.stringify(response))
            // Get the token
            const token = response.data.token;
            const userType = response.data.userType;

            // Decode the token to extract user info
            const decodedToken = jwtDecode(token);
            console.log("Decoded Token:", JSON.stringify(decodedToken.sub));

            // Store token in localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("userName", JSON.stringify(decodedToken.sub));
            localStorage.setItem("userType", userType); // Store userType
            console.log("Login successful!");
            console.log("User Type: ", response.data.userType);


            // Redirect to homepage or user dashboard after successful login
            navigate("/"); // Redirect to homepage or another page after login
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.message || "Identifiants incorrects.");
            } else {
                setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
            }
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Connexion</h2>
                {errorMessage && (
                    <div className="mb-4 text-red-500 text-center font-semibold">
                        {errorMessage}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <div className="mb-4">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Entrez votre email"
                            required
                        />
                    </div>

                    {/* Mot de passe */}
                    <div className="mb-4 relative">
                        <input
                            type={showPassword ? "text" : "password"} // Toggle password visibility
                            id="motDePasse"
                            name="motDePasse"
                            value={formData.motDePasse}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Entrez votre mot de passe"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        >
                            {showPassword ? "👁️" : "🙈"}
                        </button>
                    </div>

                    {/* Login button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 font-semibold"
                    >
                        Se connecter
                    </button>
                </form>

                {/* Link to registration page */}
                <div className="mt-4 text-center">
                    <p className="text-gray-600">
                        Pas encore de compte ?{" "}
                        <a href="/register" className="text-blue-500 font-semibold hover:underline">
                            Inscrivez-vous ici
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
