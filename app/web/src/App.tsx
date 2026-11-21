import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import Login from "./pages/Login";

import ChatLayout from "./features/chat/pages/chatLayout";

import ChatConversation from "./features/chat/pages/chatConversation";

import ChatIndexRedirect from "./features/chat/pages/chatIndexRedirect";

import "./App.css";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/chat"
                    element={<ChatLayout />}
                >
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
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
