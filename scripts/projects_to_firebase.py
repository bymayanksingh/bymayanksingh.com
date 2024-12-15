import firebase_admin
from firebase_admin import credentials, firestore
import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Firebase Admin
cred = credentials.Certificate(os.getenv('FIREBASE_ADMIN_SDK_PATH'))
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()

# Project data with all required fields
projects = [
    {
        "title": "Cascade",
        "slug": "cascade",
        "description": "A powerful AI coding assistant that helps developers write, understand, and debug code faster.",
        "details": """Cascade is a powerful AI coding assistant that helps developers write, understand, and debug code faster. It uses advanced language models to provide intelligent code suggestions, explanations, and debugging assistance.

Key Features:
1. Intelligent Code Completion: Get context-aware code suggestions
2. Code Explanation: Get detailed explanations of complex code
3. Bug Detection: Identify and fix potential bugs early
4. Code Generation: Generate boilerplate code and common patterns
5. Documentation Help: Get help with documentation and comments""",
        "technologies": [
            "TypeScript",
            "React",
            "Node.js",
            "Firebase",
            "Tailwind CSS"
        ],
        "category": "Development Tools",
        "status": "Live",
        "featured": True,
        "year": 2023,
        "github_url": "https://github.com/mayank/cascade",
        "website_url": "https://cascade.dev",
        "coverImage": {
            "url": "https://source.unsplash.com/random/800x600/?code,programming",
            "credit": {
                "name": "Unsplash",
                "link": "https://unsplash.com"
            }
        },
        "gallery": [
            {
                "url": "https://source.unsplash.com/random/800x600/?developer,coding",
                "caption": "Code completion in action"
            },
            {
                "url": "https://source.unsplash.com/random/800x600/?debugging,computer",
                "caption": "Bug detection feature"
            }
        ],
        "created_at": datetime.datetime.now().isoformat(),
        "updated_at": datetime.datetime.now().isoformat()
    },
    {
        "title": "Portfolio Website",
        "slug": "portfolio-website",
        "description": "My personal portfolio website showcasing my projects and skills.",
        "details": """My personal portfolio website built with modern web technologies. It features a clean, minimalist design with dark mode support and smooth animations.

Key Features:
1. Responsive Design: Works perfectly on all devices
2. Dark Mode: Easy on the eyes with dark mode support
3. Project Showcase: Detailed project pages with images and descriptions
4. Blog Section: Technical articles and project updates
5. Contact Form: Easy way to get in touch""",
        "technologies": [
            "TypeScript",
            "React",
            "Next.js",
            "Tailwind CSS",
            "Firebase"
        ],
        "category": "Web Development",
        "status": "Live",
        "featured": True,
        "year": 2023,
        "github_url": "https://github.com/mayank/portfolio",
        "website_url": "https://bymayanksingh.com",
        "coverImage": {
            "url": "https://source.unsplash.com/random/800x600/?portfolio,website",
            "credit": {
                "name": "Unsplash",
                "link": "https://unsplash.com"
            }
        },
        "created_at": datetime.datetime.now().isoformat(),
        "updated_at": datetime.datetime.now().isoformat()
    },
    {
        "title": "Color Picker Extension",
        "slug": "color-picker-extension",
        "description": "A Chrome extension for picking colors from any webpage with advanced color manipulation features.",
        "details": """A powerful Chrome extension that helps designers and developers pick colors from any webpage. It includes advanced features like color palettes, contrast checking, and color manipulation.

Key Features:
1. Color Picking: Pick colors from any webpage
2. Color Palettes: Save and organize color palettes
3. Color Manipulation: Adjust hue, saturation, and brightness
4. Accessibility: Check color contrast ratios
5. Export Options: Export colors in various formats""",
        "technologies": [
            "JavaScript",
            "React",
            "Chrome Extension",
            "HTML",
            "CSS",
            "Tailwind CSS"
        ],
        "category": "Browser Extension",
        "status": "Live",
        "featured": False,
        "year": 2023,
        "github_url": "https://github.com/mayank/color-picker",
        "website_url": "https://chrome.google.com/webstore/detail/color-picker",
        "coverImage": {
            "url": "https://source.unsplash.com/random/800x600/?colors,design",
            "credit": {
                "name": "Unsplash",
                "link": "https://unsplash.com"
            }
        },
        "created_at": datetime.datetime.now().isoformat(),
        "updated_at": datetime.datetime.now().isoformat()
    }
]

# Upload projects to Firebase
def upload_projects():
    for project in projects:
        # Create a new document with auto-generated ID
        doc_ref = db.collection('projects').document(project['slug'])
        doc_ref.set(project)
    print("All projects uploaded successfully!")

if __name__ == "__main__":
    upload_projects()
