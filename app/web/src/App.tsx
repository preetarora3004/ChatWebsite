import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import "./App.css";

import ChatLayout from "./pages/chat/ChatLayout";
import ChatConversation, {
    ChatIndexRedirect,
} from "./pages/chat/ChatConversation";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/chat" element={<ChatLayout />}>
                    {/* Redirect to the first available conversation */}
                    <Route
                        index
                        element={<ChatIndexRedirect />}
                    />

                    {/* Dynamic conversation route */}
                    <Route
                        path=":chatId"
                        element={<ChatConversation />}
                    />
                </Route>

                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}
