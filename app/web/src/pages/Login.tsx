import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleLogin(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!username.trim() || !password) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/api/v1/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username.trim(),
                    password,
                }),
            });

            if (!response.ok) {
                const result: unknown = await response.json().catch(() => null);

                const message =
                    typeof result === "object" &&
                    result !== null &&
                    "message" in result &&
                    typeof result.message === "string"
                        ? result.message
                        : "Invalid username or password";

                throw new Error(message);
            }

            sessionStorage.setItem("username", username.trim());

            navigate("/chat");
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong",
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-blue-950 p-6">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-2xl">

                <h1 className="text-3xl font-bold text-white">
                    Welcome back
                </h1>

                <p className="mt-2 text-sm text-blue-200/60">
                    Sign in to start chatting.
                </p>

                <form onSubmit={handleLogin} className="mt-8 space-y-5">

                    <div>
                        <label className="text-sm text-blue-100">
                            Username
                        </label>

                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            autoComplete="username"
                            required
                            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-blue-400"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-blue-100">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            autoComplete="current-password"
                            required
                            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-blue-400"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-blue-500 py-3 font-semibold text-white transition hover:bg-blue-400 disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>

                </form>
            </div>
        </main>
    );
}
