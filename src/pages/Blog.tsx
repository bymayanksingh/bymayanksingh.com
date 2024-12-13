import { useState, useEffect, lazy, Suspense, memo } from 'react';
import { Terminal, Calendar, Clock, Tag, Info, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogPosts } from '../data/blogData';
import { PageHeader } from '../components/PageHeader';
import { TerminalLoader } from '../components/TerminalLoader';
import type { BlogPost as BlogPostType } from '../data/blogData';

// Memoized BlogCard component
const BlogCard = memo(({ post, index }: { post: BlogPostType; index: number }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
  >
    <Link to={`/blog/${post.slug}`} className="block">
      <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg overflow-hidden hover:border-green-500/30 transition-all duration-300 backdrop-blur-sm">
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
              <span>blog_post_{index + 1}.md</span>
            </div>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="p-6 font-mono">
          {/* Command Line */}
          <div className="text-sm text-gray-400 mb-4 flex items-center space-x-2">
            <span className="text-green-400">$</span>
            <span>cat title.txt</span>
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold text-white mb-4 hover:text-green-400 transition-colors duration-300">
            {post.title}
          </h2>

          {/* Metadata Command */}
          <div className="text-sm text-gray-400 mb-2 flex items-center space-x-2">
            <span className="text-green-400">$</span>
            <span>get metadata</span>
          </div>

          {/* Metadata */}
          <div className="pl-4 border-l-2 border-gray-800">
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          {/* Tags Command */}
          <div className="text-sm text-gray-400 mt-4 mb-2 flex items-center space-x-2">
            <span className="text-green-400">$</span>
            <span>list tags</span>
          </div>

          {/* Tags */}
          <div className="pl-4 border-l-2 border-gray-800">
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

          {/* Description */}
          <div className="mt-4 text-sm text-gray-400">
            <p>{post.description}</p>
            <div className="mt-4 flex items-center text-green-400 hover:text-green-500 transition-colors">
              <span>Read more</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  </motion.article>
));

BlogCard.displayName = 'BlogCard';

// Loading skeleton component
const BlogCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-900/50 border border-gray-800/50 rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 bg-gray-900/80 border-b border-gray-800/50">
        <div className="h-4 bg-gray-800 rounded w-1/4"></div>
      </div>
      <div className="p-6">
        <div className="h-6 bg-gray-800 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-800 rounded w-1/2 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-800 rounded w-full"></div>
          <div className="h-4 bg-gray-800 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  </div>
);

export function Blog() {
  const [loading, setLoading] = useState(true);
  const [displayPosts, setDisplayPosts] = useState<BlogPostType[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadPosts = async () => {
      // Simulate network delay for demonstration
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (isMounted) {
        setDisplayPosts(blogPosts);
        setLoading(false);
      }
    };

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          path="blog"
          description="Thoughts, tutorials, and insights about software development"
        />

        {/* Add instruction message */}
        <div className="flex items-center gap-2 mb-8 p-4 rounded-lg bg-gray-900/50 border border-gray-800/50 text-gray-400">
          <Info className="w-5 h-5 text-green-400" />
          <span className="text-sm">
            Click on any blog card to read the full article in a dedicated page
          </span>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <BlogCardSkeleton key={index} />
              ))
            : displayPosts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
        </div>
      </div>
    </div>
  );
}