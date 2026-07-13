import { Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';

@Resolver(() => User)
export class UserResolver {

    @Query(() => User, {name: 'user'})
    async getUser() {
        // Simulate fetching user data from a database or service
        // 
        return [] as User[]; // Return an empty array for demonstration purposes
    }
}