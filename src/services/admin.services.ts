import { getUsersStats } from '../repositories/user.repositories';
import { UserStats } from '../types';
class adminService {
    async getStats(): Promise<UserStats[] | undefined>{
        const data = await getUsersStats();
        return data;
    }
}

const service = new adminService();

export default service;
