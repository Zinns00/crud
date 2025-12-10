// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import RetroButton from "@/components/RetroButton";
import WoodBackground from "@/components/WoodBackground"; // 배경 컴포넌트 추가

function Login() {
    const navigate = useNavigate();
    const [inputId, setInputId] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [isSignup, setIsSignup] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();

        if (isSignup) {
            if (!inputId.includes("@")) {
                alert("Please enter a valid email to sign up!");
                return;
            }
            if (!username) {
                alert("Please enter a username!");
                return;
            }

            const { data, error } = await supabase.auth.signUp({
                email: inputId,
                password,
                options: { data: { username } },
            });

            if (error) {
                alert("Signup failed: " + error.message);
            } else {
                // Manually sign in the user after successful sign-up to get a session
                const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                    email: inputId,
                    password,
                });
                if (signInError) {
                    alert("Signup successful, but auto-login failed. Please log in manually.");
                    navigate("/login");
                } else {
                    alert("Signup successful! You are now logged in.");
                    navigate("/");
                }
            }
        } else {
            let emailToLogin = inputId;
            if (!inputId.includes("@")) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('email')
                    .eq('username', inputId)
                    .single();

                if (error || !data) {
                    alert("This username does not exist.");
                    return;
                }
                emailToLogin = data.email;
            }

            const { error } = await supabase.auth.signInWithPassword({
                email: emailToLogin,
                password,
            });

            if (error) {
                alert("Login failed: Please check your credentials.");
            } else {
                alert("Login successful!");
                navigate("/");
            }
        }
    };

    const inputStyle = "w-full p-2 mb-4 bg-white border-4 border-text-dark rounded-none font-body focus:outline-none focus:ring-2 focus:ring-pin-blue";

    return (
        <WoodBackground>
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="relative w-full max-w-md bg-note-yellow p-8 border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,0.8)]">
                    <div className="absolute w-6 h-6 rounded-full shadow-md bg-pin-red top-2 left-4"></div>
                    <h1 className="font-heading text-4xl text-center mb-6 text-text-dark">
                        {isSignup ? "Create Account" : "Login"}
                    </h1>
                    <form onSubmit={handleAuth}>
                        {isSignup && (
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={inputStyle}
                            />
                        )}

                        <input
                            type="text"
                            placeholder={isSignup ? "Email" : "Email or Username"}
                            value={inputId}
                            onChange={(e) => setInputId(e.target.value)}
                            className={inputStyle}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={inputStyle}
                            required
                        />
                        <RetroButton type="submit" className="w-full bg-note-blue">
                            {isSignup ? "Sign Up" : "Login"}
                        </RetroButton>
                    </form>

                    <p className="mt-6 text-center font-body text-text-dark">
                        {isSignup ? "Already have an account?" : "Don't have an account?"}
                        <button
                            onClick={() => {
                                setIsSignup(!isSignup);
                                setInputId("");
                                setUsername("");
                                setPassword("");
                            }}
                            className="bg-transparent border-none text-pin-blue cursor-pointer underline ml-2 font-bold"
                        >
                            {isSignup ? "Login here" : "Sign up here"}
                        </button>
                    </p>
                </div>
            </div>
        </WoodBackground>
    );
}

export default Login;