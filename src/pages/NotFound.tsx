import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';

export function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-950 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <PageHeader
                    path="404"
                    description="Error: Page not found"
                />
                <div className="text-center mt-8">
                    <div className="text-gray-400 mb-4 font-mono">
                        <span className="text-green-400">$</span> cd ../home
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-gray-800 text-green-400 rounded-lg hover:bg-gray-700 transition-colors font-mono"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        </div>
    );
} 