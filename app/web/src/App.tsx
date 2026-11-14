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
                    <Route
                        index
                        element={<ChatIndexRedirect />}
                    />

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
