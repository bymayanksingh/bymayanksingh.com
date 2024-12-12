import { useState, useEffect } from 'react';
import { Terminal, Code, Star, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageHeader } from '../components/PageHeader';
import { fallbackBooks } from '../config/fallbackData';
import { ImageModal } from '../components/ImageModal';
import type { Book } from '../config/fallbackData';

export function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        // TODO: Replace with Firebase fetch when ready
        setBooks(fallbackBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= rating
                ? 'text-green-400'
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          path="books"
          description="My reading list and book reviews"
        />

        {/* Terminal Window */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden">
          {/* Window Controls */}
          <div className="flex items-center space-x-2 px-4 py-2 bg-gray-900/80 border-b border-gray-800">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="ml-4 flex items-center space-x-2 text-gray-400">
              <Terminal className="w-4 h-4" />
              <span className="text-sm font-mono">~/reading-list</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            <div className="flex items-center space-x-2 text-gray-400 text-xs sm:text-sm font-mono mb-6">
              <Code className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>cat technical-books.md</span>
            </div>

            {loading ? (
              <div className="text-gray-400 font-mono">Loading books...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {books.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => setSelectedBook(book)}
                    className="group cursor-pointer"
                  >
                    <div className="bg-gray-800/50 border border-gray-700 hover:border-green-500/30 rounded-lg p-4 transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        <div className="w-20 h-28 flex-shrink-0 overflow-hidden rounded-md">
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-green-400 font-mono font-medium mb-1">
                            {book.title}
                          </h3>
                          <p className="text-gray-400 text-xs mb-2">
                            {book.author}
                          </p>
                          <div className="mb-2">
                            <StarRating rating={book.rating} />
                          </div>
                          <p className="text-gray-500 text-xs font-mono">
                            {book.genre}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal for Book Details */}
      <ImageModal
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        title={selectedBook?.title}
        image={selectedBook?.coverImage}
        renderImage={({ url }) => (
          <div className="bg-gray-900 p-6 rounded-lg max-w-2xl w-full">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-full sm:w-1/3">
                <img
                  src={url}
                  alt={selectedBook?.title}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <div className="w-full sm:w-2/3 space-y-4">
                <h3 className="text-green-400 font-mono text-lg font-medium">
                  {selectedBook?.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  by {selectedBook?.author}
                </p>
                <div className="flex items-center space-x-4">
                  <StarRating rating={selectedBook?.rating || 0} />
                  <span className="text-gray-500 text-xs font-mono">
                    {selectedBook?.genre}
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-300 text-sm">
                    {selectedBook?.description}
                  </p>
                  <div className="pt-2 border-t border-gray-700">
                    <p className="text-gray-400 text-sm italic">
                      "{selectedBook?.review}"
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
                    <span>
                      Read: {new Date(selectedBook?.readDate || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
