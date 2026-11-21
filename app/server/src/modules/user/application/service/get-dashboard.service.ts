import type { GetDashboardRepository } from "../../infrastructure/repository/get-dashboard.repository";

export class GetDashboardService {
    constructor(
        private readonly getDashboardRepository: GetDashboardRepository,
    ) { }

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
