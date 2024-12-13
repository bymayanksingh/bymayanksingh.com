import React, { Suspense, lazy } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Terminal, Calendar, Clock, ArrowLeft, Tag, User, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { blogPosts } from '../data/blogData';

// Lazy load ReactMarkdown and SyntaxHighlighter
const ReactMarkdown = lazy(() => import('react-markdown'));
const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter').then(mod => ({ 
  default: mod.Prism 
})));
const oneDark = lazy(() => import('react-syntax-highlighter/dist/esm/styles/prism/one-dark').then(mod => ({ 
  default: mod.default 
})));

// Loading skeleton for the blog post
const BlogPostSkeleton = () => (
  <div className="animate-pulse">
    <div className="space-y-4">
      <div className="h-8 bg-gray-800 rounded w-3/4"></div>
      <div className="h-4 bg-gray-800 rounded w-1/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-800 rounded w-full"></div>
        <div className="h-4 bg-gray-800 rounded w-5/6"></div>
        <div className="h-4 bg-gray-800 rounded w-4/6"></div>
      </div>
    </div>
  </div>
);

// Memoized content components
const MarkdownContent = React.memo(({ content }: { content: string }) => (
  <Suspense fallback={<BlogPostSkeleton />}>
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <Suspense fallback={<div className="animate-pulse h-32 bg-gray-800 rounded"></div>}>
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </Suspense>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  </Suspense>
));

MarkdownContent.displayName = 'MarkdownContent';

export function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const post = blogPosts.find(post => post.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-950 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl text-white mb-4">404: Post not found</h1>
            <button
              onClick={() => navigate('/blog')}
              className="text-green-400 hover:text-green-500"
            >
              cd ../blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gray-950 pt-20"
    >
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors duration-300 mb-8 font-mono"
        >
          <ChevronRight className="w-4 h-4" />
          <span>cd ../blog</span>
        </Link>

        {/* Terminal Window */}
        <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg overflow-hidden backdrop-blur-sm">
          {/* Terminal Header */}
          <div className="px-4 py-2.5 bg-gray-900/80 border-b border-gray-800/50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
              </div>
              <div className="text-xs text-gray-500 font-medium pl-2 flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>{post.slug}.md</span>
              </div>
            </div>
          </div>

          {/* Terminal Content */}
          <div className="p-6 font-mono">
            {/* Title Section */}
            <div className="mb-6">
              <div className="text-sm text-gray-400 mb-2 flex items-center space-x-2">
                <span className="text-green-400">$</span>
                <span>cat title.md</span>
              </div>
              <h1 className="text-2xl font-bold text-white pl-4 border-l-2 border-gray-800">
                {post.title}
              </h1>
            </div>

            {/* Metadata Section */}
            <div className="mb-6">
              <div className="text-sm text-gray-400 mb-2 flex items-center space-x-2">
                <span className="text-green-400">$</span>
                <span>get metadata</span>
              </div>
              <div className="pl-4 border-l-2 border-gray-800">
                <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{post.author.name}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, i) => (
                    <div
                      key={i}
                      className="inline-flex items-center space-x-1 text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded"
                    >
                      <Tag className="w-3 h-3" />
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="mb-6">
              <div className="text-sm text-gray-400 mb-2 flex items-center space-x-2">
                <span className="text-green-400">$</span>
                <span>cat content.md</span>
              </div>
              <div className="pl-4 border-l-2 border-gray-800 prose prose-invert prose-sm max-w-none">
                <MarkdownContent content={post.content} />
              </div>
            </div>
          </div>
        </div>
      </article>
    </motion.div>
  );
}