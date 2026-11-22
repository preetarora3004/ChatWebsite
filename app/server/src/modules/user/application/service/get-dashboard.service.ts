import type { GetDashboardServicePort } from "../interface/inbound/dashboard-service.port";
import type { IGetDashboard } from "../interface/outbound/get-dashboard.repository";

export class GetDashboardService implements GetDashboardServicePort {
    constructor(private readonly getDashboardRepository: IGetDashboard) { }

    public async getDashboard(userId: string) {
        const dashboard = await this.getDashboardRepository.getDashboard(userId);

        // const result = dashboard?.chatMembers.map((idx) => ({
        //     chatId: idx.chat.id,
        //     participants: idx.chat.chatMembers,
        // }));

        //cache chatParticipants

        return dashboard;
    }
}
