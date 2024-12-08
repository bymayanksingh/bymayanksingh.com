export interface BlogPost {
  id: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  slug: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Building Modern Web Applications with React and TypeScript',
    description: 'A comprehensive guide to setting up and developing scalable web applications using React 18 and TypeScript, including best practices and common pitfalls to avoid.',
    date: '2024-03-15',
    readTime: '8 min read',
    tags: ['React', 'TypeScript', 'Web Development'],
    slug: 'building-modern-web-applications',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop',
    author: {
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop',
      role: 'Senior Frontend Developer'
    },
    content: `
## Introduction

React and TypeScript have become the go-to combination for building modern web applications. In this comprehensive guide, we'll explore how to set up a new project and implement best practices for scalable development.

### Setting Up Your Development Environment

First, let's create a new React project with TypeScript using Vite:

\`\`\`bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
\`\`\`

### Key Benefits of TypeScript in React

1. **Type Safety**: Catch errors during development
2. **Better IDE Support**: Enhanced autocomplete and refactoring
3. **Improved Maintainability**: Self-documenting code
4. **Enhanced Component Props**: Clear interface definitions

### Example Component

Here's a simple example of a typed React component:

\`\`\`typescript
interface UserProfileProps {
  name: string;
  age: number;
  email: string;
  isAdmin?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  name, 
  age, 
  email, 
  isAdmin = false 
}) => {
  return (
    <div className="user-profile">
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
      {isAdmin && <span className="admin-badge">Admin User</span>}
    </div>
  );
};
\`\`\`

### Best Practices

1. 
`
  }
]; 