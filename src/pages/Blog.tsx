import React from 'react';
import { Terminal, Calendar, Clock, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { blogPosts } from '../data/blogData';

export function Blog() {
    return (
        <div className="min-h-screen bg-gray-950 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center space-x-2 mb-4">
                        <Terminal className="w-5 h-5 text-green-400" />
                        <h1 className="text-2xl text-white">~/blog</h1>
                    </div>
                    <p className="text-gray-400 flex items-center gap-2">
                        <span className="text-green-400">$</span>
                        <span className="font-mono">ls -la ./posts</span>
                    </p>
                </div>

                {/* Blog Posts Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                    {blogPosts.map((post, index) => (
                        <motion.article
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Link to={`/blog/${post.slug}`}>
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
                                        <div className="pl-4 mb-4 border-l-2 border-gray-800">
                                            <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
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

                                        {/* Description Command */}
                                        <div className="text-sm text-gray-400 mb-2 flex items-center space-x-2">
                                            <span className="text-green-400">$</span>
                                            <span>head -n 2 description.txt</span>
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-400 text-sm mb-4 pl-4 border-l-2 border-gray-800">
                                            {post.description}
                                        </p>

                                        {/* Tags Command */}
                                        <div className="text-sm text-gray-400 mb-2 flex items-center space-x-2">
                                            <span className="text-green-400">$</span>
                                            <span>ls tags/</span>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 pl-4 border-l-2 border-gray-800">
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
                            </Link>
                        </motion.article>
                    ))}
                </div>
            </div>
        </div>
    );
} 