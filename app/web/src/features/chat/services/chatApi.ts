import type {
    Dashboard,
    DashboardApiResponse,
} from "../types/chat.types";

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchDashboard(): Promise<Dashboard> {
    const response = await fetch(
        `${API_URL}/api/v1/user/dashboard`,
        {
            method: "GET",
            credentials: "include",
        },
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch dashboard",
        );
    }

    const data: DashboardApiResponse =
        await response.json();

    if (!data.success) {
        throw new Error(
            "Dashboard request was unsuccessful",
        );
    }

    return data.body;
}
