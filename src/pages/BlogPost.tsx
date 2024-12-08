import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Terminal, Calendar, Clock, ArrowLeft, Tag, User, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { blogPosts } from '../data/blogData';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
        <div className="min-h-screen bg-gray-950 pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <Link
                    to="/blog"
                    className="inline-flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors duration-300 mb-8 font-mono"
                >
                    <ChevronRight className="w-4 h-4" />
                    <span>cd ../blog</span>
                </Link>

                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
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
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.map((tag) => (
                                            <div
                                                key={tag}
                                                className="flex items-center space-x-1 text-xs px-2 py-1 bg-gray-800/50 text-green-400 rounded"
                                            >
                                                <Tag className="w-3 h-3" />
                                                <span>{tag}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Author Section */}
                            <div className="mb-6">
                                <div className="text-sm text-gray-400 mb-2 flex items-center space-x-2">
                                    <span className="text-green-400">$</span>
                                    <span>get author</span>
                                </div>
                                <div className="pl-4 border-l-2 border-gray-800">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={post.author.avatar}
                                            alt={post.author.name}
                                            className="w-10 h-10 rounded-full"
                                        />
                                        <div>
                                            <div className="text-white">{post.author.name}</div>
                                            <div className="text-gray-400 text-sm">{post.author.role}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div>
                                <div className="text-sm text-gray-400 mb-4 flex items-center space-x-2">
                                    <span className="text-green-400">$</span>
                                    <span>cat content.md</span>
                                </div>
                                <div className="pl-4 border-l-2 border-gray-800">
                                    <div className="prose prose-invert prose-green max-w-none">
                                        <ReactMarkdown
                                            components={{
                                                code({ node, inline, className, children, ...props }) {
                                                    const match = /language-(\w+)/.exec(className || '');
                                                    return !inline && match ? (
                                                        <SyntaxHighlighter
                                                            style={oneDark}
                                                            language={match[1]}
                                                            PreTag="div"
                                                            className="rounded-md"
                                                            {...props}
                                                        >
                                                            {String(children).replace(/\n$/, '')}
                                                        </SyntaxHighlighter>
                                                    ) : (
                                                        <code className={className} {...props}>
                                                            {children}
                                                        </code>
                                                    );
                                                },
                                                // Customize other markdown elements
                                                h2: ({ children }) => (
                                                    <h2 className="text-xl font-bold text-white mt-8 mb-4">{children}</h2>
                                                ),
                                                h3: ({ children }) => (
                                                    <h3 className="text-lg font-bold text-white mt-6 mb-3">{children}</h3>
                                                ),
                                                p: ({ children }) => (
                                                    <p className="text-gray-300 mb-4">{children}</p>
                                                ),
                                                ul: ({ children }) => (
                                                    <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">{children}</ul>
                                                ),
                                                ol: ({ children }) => (
                                                    <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2">{children}</ol>
                                                ),
                                            }}
                                        >
                                            {post.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.article>
            </div>
        </div>
    );
} 