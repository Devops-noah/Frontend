import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        motDePasse: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [needsGoogleAuth, setNeedsGoogleAuth] = useState(false);
    const [isGmailUser, setIsGmailUser] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // ✅ Check if user is already logged in
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/"); // ✅ Redirect to home if already logged in
            return;
        }

        // ✅ Handle Auto-Login After Google Authorization
        const params = new URLSearchParams(window.location.search);
        const tokenFromUrl = params.get("token");
        const userId = params.get("userId");
        const role = params.get("role");

        if (tokenFromUrl && userId && role) {
            console.log("🔹 Auto-login after Google Auth...");

            // ✅ Store the token in localStorage
            localStorage.setItem("token", tokenFromUrl);
            localStorage.setItem("userId", userId);
            localStorage.setItem("userRole", role);

            // ✅ Clear URL params (prevent re-login on refresh)
            window.history.replaceState({}, document.title, window.location.pathname);

            // ✅ Redirect to home
            navigate("/");
        }
    }, [navigate]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Check if the email belongs to a Gmail account
        if (name === "email") {
            setIsGmailUser(value.toLowerCase().endsWith("@gmail.com"));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", formData, {
                headers: { "Content-Type": "application/json" },
            });

            console.log("Response data from login:", response.data);

            const { token, role, userType, userId, needsGoogleAuth } = response.data;

            // ✅ Store user info
            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId);
            localStorage.setItem("userRole", role);
            localStorage.setItem("userType", userType || "");

            if (needsGoogleAuth) {
                setNeedsGoogleAuth(true); // Show Google Auth button
            } else {
                navigate("/"); // ✅ Redirect user if no Google Auth is required
            }

        } catch (error) {
            console.error("Login error:", error);

            if (error.response) {
                const errorMessage = error.response.data.message || "Identifiants incorrects.";

                // ✅ If Gmail user needs Google Auth, show button
                if (error.response.status === 403 && error.response.data.needsGoogleAuth) {
                    setNeedsGoogleAuth(true);
                    setErrorMessage("Vous devez autoriser Google Calendar pour continuer.");
                } else {
                    setErrorMessage(errorMessage);
                }
            } else {
                setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
            }
        }
    };



    const handleGoogleAuth = () => {
        console.log("Google Client ID:", process.env.REACT_APP_GOOGLE_CLIENT_ID);
        const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID; // Replace with your actual Client ID
        const redirectUri = "http://localhost:8080/api/auth/callback";
        const scope = "https://www.googleapis.com/auth/calendar.events";
        const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${encodeURIComponent(formData.email)}`;

        console.log("Redirecting user to Google OAuth:", authUrl);

        // Show a loading message before redirecting
        alert("Vous allez être redirigé vers Google pour autoriser votre calendrier.");
        window.location.href = authUrl;
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
                            type={showPassword ? "text" : "password"}
                            id="motDePasse"
                            name="motDePasse"
                            value={formData.motDePasse}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="°°°°°°°°°°"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
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

                {/* Google Auth Button */}
                {needsGoogleAuth && isGmailUser && (
                    <div className="mt-4 text-center">
                        {/*<p className="text-red-500 font-semibold">*/}
                        {/*    Vous devez autoriser Google Calendar pour continuer.*/}
                        {/*</p>*/}
                        <button
                            onClick={handleGoogleAuth}
                            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 font-semibold inline-block mt-2"
                        >
                            Autoriser Google Calendar
                        </button>
                    </div>
                )}

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
