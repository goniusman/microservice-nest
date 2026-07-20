// book-service/src/auth/interfaces/policy.interface.ts
export interface UserContext {
  id: string;
  roles: string[];
}

export interface ResourceDocument {
  id: string;
  createdBy?: string;
  authorId?: string; // Adjust based on your schema fields
  [key: string]: any;
}








