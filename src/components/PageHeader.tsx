import React from 'react';
import { Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
    path: string;
    description?: string;
}

export function PageHeader({ path, description }: PageHeaderProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
                <Terminal className="w-5 h-5 text-green-400" />
                <h1 className="text-2xl text-white">~/{path}</h1>
            </div>
            {description && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 flex items-center gap-2"
                >
                    <span className="text-green-400">$</span>
                    echo "{description}"
                </motion.p>
            )}
        </div>
    );
} 