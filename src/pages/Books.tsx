import { useState, useEffect } from 'react';
import { Terminal, Code, Star, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageHeader } from '../components/PageHeader';
import { fallbackBooks } from '../config/fallbackData';
import type { Book } from '../config/fallbackData';

export function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-400'
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

        {/* Books Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-2 mb-4">
            <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
            <h2 className="text-xl sm:text-2xl text-green-400">~/reading-list</h2>
          </div>
          <div className="flex items-center space-x-2 text-gray-400 text-xs sm:text-sm pl-6 sm:pl-7 mb-4">
            <Code className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>cat technical-books.md</span>
          </div>

          {loading ? (
            <div className="pl-6 sm:pl-7 text-gray-400">Loading books...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pl-6 sm:pl-7">
              {books.map((book) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-lg overflow-hidden hover:border-green-500/30 transition-all duration-300 group"
                >
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-green-400 mb-1">
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-400">{book.author}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{book.genre}</span>
                        <StarRating rating={book.rating} />
                      </div>
                      <p className="text-sm text-gray-300">{book.description}</p>
                      <div className="pt-2 border-t border-gray-800">
                        <p className="text-sm text-gray-400 italic">"{book.review}"</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Read: {new Date(book.readDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                      <BookOpen className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
