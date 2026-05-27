import { randomUUID } from "crypto";

export interface User {
  id: string;
  userId: string;
  password: string;
  name: string;
  email: string;
  role: "admin" | "general";
  department: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Record {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "published" | "draft" | "archived";
  accessLevel: "all" | "admin";
  priority: "high" | "medium" | "low";
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  userId: string;
  role: string;
  expiresAt: number;
}

const users: User[] = [
  {
    id: "1",
    userId: "admin01",
    password: "Admin@123",
    name: "Alexandra Chen",
    email: "alex.chen@nexus.io",
    role: "admin",
    department: "Engineering",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    userId: "superadmin",
    password: "Admin@123",
    name: "Marcus Reyes",
    email: "m.reyes@nexus.io",
    role: "admin",
    department: "Operations",
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: "3",
    userId: "john.doe",
    password: "User@123",
    name: "John Doe",
    email: "john.doe@nexus.io",
    role: "general",
    department: "Marketing",
    status: "active",
    createdAt: "2024-02-20",
  },
  {
    id: "4",
    userId: "jane.smith",
    password: "User@123",
    name: "Jane Smith",
    email: "jane.smith@nexus.io",
    role: "general",
    department: "Sales",
    status: "active",
    createdAt: "2024-03-10",
  },
  {
    id: "5",
    userId: "bob.wilson",
    password: "User@123",
    name: "Bob Wilson",
    email: "bob.wilson@nexus.io",
    role: "general",
    department: "Finance",
    status: "active",
    createdAt: "2024-03-25",
  },
  {
    id: "6",
    userId: "sarah.jones",
    password: "User@123",
    name: "Sarah Jones",
    email: "sarah.jones@nexus.io",
    role: "general",
    department: "HR",
    status: "inactive",
    createdAt: "2024-04-05",
  },
];

const records: Record[] = [
  {
    id: "REC-001",
    title: "Q1 2024 Revenue Summary",
    description:
      "Comprehensive overview of Q1 revenue streams including SaaS subscriptions and enterprise contracts.",
    category: "Finance",
    status: "published",
    accessLevel: "all",
    priority: "high",
    author: "Alexandra Chen",
    createdAt: "2024-04-01",
    updatedAt: "2024-04-10",
  },
  {
    id: "REC-002",
    title: "Employee Headcount Analysis (Confidential)",
    description:
      "Detailed breakdown of headcount by department, salary bands, and projected hiring plans for FY2024.",
    category: "HR",
    status: "draft",
    accessLevel: "admin",
    priority: "high",
    author: "Marcus Reyes",
    createdAt: "2024-04-05",
    updatedAt: "2024-04-12",
  },
  {
    id: "REC-003",
    title: "Product Roadmap — H2 2024",
    description:
      "Engineering roadmap covering planned feature releases, technical debt retirement, and platform migrations.",
    category: "Engineering",
    status: "published",
    accessLevel: "all",
    priority: "medium",
    author: "Alexandra Chen",
    createdAt: "2024-03-20",
    updatedAt: "2024-04-08",
  },
  {
    id: "REC-004",
    title: "Customer Acquisition Report",
    description:
      "Marketing funnel analysis showing lead conversion rates, CAC by channel, and ROI on campaigns.",
    category: "Marketing",
    status: "published",
    accessLevel: "all",
    priority: "medium",
    author: "John Doe",
    createdAt: "2024-03-28",
    updatedAt: "2024-04-02",
  },
  {
    id: "REC-005",
    title: "Board Meeting Minutes — March 2024",
    description:
      "Confidential board meeting minutes including strategic decisions and financial disclosures.",
    category: "Executive",
    status: "archived",
    accessLevel: "admin",
    priority: "high",
    author: "Marcus Reyes",
    createdAt: "2024-03-15",
    updatedAt: "2024-03-16",
  },
  {
    id: "REC-006",
    title: "Sales Pipeline — Enterprise Accounts",
    description:
      "Current enterprise sales pipeline with deal stages, estimated close dates, and contract values.",
    category: "Sales",
    status: "published",
    accessLevel: "all",
    priority: "high",
    author: "Jane Smith",
    createdAt: "2024-04-02",
    updatedAt: "2024-04-11",
  },
  {
    id: "REC-007",
    title: "System Architecture Proposal",
    description:
      "Technical proposal for migrating legacy services to microservices architecture on AWS EKS.",
    category: "Engineering",
    status: "draft",
    accessLevel: "all",
    priority: "medium",
    author: "Alexandra Chen",
    createdAt: "2024-04-08",
    updatedAt: "2024-04-09",
  },
  {
    id: "REC-008",
    title: "Salary Benchmarking Report (Confidential)",
    description:
      "Industry salary comparison data by role and seniority level. For HR and executive review only.",
    category: "HR",
    status: "published",
    accessLevel: "admin",
    priority: "medium",
    author: "Sarah Jones",
    createdAt: "2024-02-20",
    updatedAt: "2024-03-01",
  },
  {
    id: "REC-009",
    title: "Partnership Agreement — TechCorp Alliance",
    description:
      "Executed partnership agreement covering API integrations, co-marketing, and revenue sharing terms.",
    category: "Legal",
    status: "archived",
    accessLevel: "all",
    priority: "low",
    author: "Marcus Reyes",
    createdAt: "2024-01-30",
    updatedAt: "2024-02-01",
  },
  {
    id: "REC-010",
    title: "Infrastructure Cost Analysis (Confidential)",
    description:
      "Detailed cloud infrastructure spend analysis with optimization recommendations and projected savings.",
    category: "Finance",
    status: "draft",
    accessLevel: "admin",
    priority: "high",
    author: "Bob Wilson",
    createdAt: "2024-04-10",
    updatedAt: "2024-04-11",
  },
];

const sessions = new Map<string, Session>();

export function findUserByCredentials(
  userId: string,
  password: string,
): User | undefined {
  return users.find((u) => u.userId === userId && u.password === password);
}

export function createSession(userId: string, role: string): string {
  const token = randomUUID();
  sessions.set(token, {
    userId,
    role,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  });
  return token;
}

export function validateSession(token: string): Session | null {
  const session = sessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }
  return session;
}

export function deleteSession(token: string): void {
  sessions.delete(token);
}

export function getUserByUserId(userId: string): User | undefined {
  return users.find((u) => u.userId === userId);
}

export function getAllUsers(): Omit<User, "password">[] {
  return users.map(({ password: _p, ...u }) => u);
}

export function createUser(
  data: Omit<User, "id">,
): Omit<User, "password"> {
  const newUser: User = { ...data, id: randomUUID() };
  users.push(newUser);
  const { password: _p, ...result } = newUser;
  return result;
}

export function updateUser(
  id: string,
  data: Partial<Omit<User, "id">>,
): Omit<User, "password"> | null {
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx]!, ...data };
  const { password: _p, ...result } = users[idx]!;
  return result;
}

export function deleteUser(id: string): boolean {
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return false;
  users.splice(idx, 1);
  return true;
}

export function getRecords(role: string): Record[] {
  if (role === "admin") return records;
  return records.filter((r) => r.accessLevel === "all");
}
