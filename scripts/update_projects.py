import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import requests
import re

# Initialize Firebase Admin
cred = credentials.Certificate('/Users/admin/Downloads/bymayanksingh-firebase-adminsdk-jmdt5-f612894ec8.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

def get_unsplash_image(query):
    """Get a relevant image from Unsplash based on project type"""
    try:
        # Using the public Unsplash API (limited to 50 requests per hour)
        url = f"https://api.unsplash.com/photos/random?query={query}&orientation=landscape"
        headers = {
            "Authorization": "Client-ID YOUR_UNSPLASH_ACCESS_KEY"  # Replace with your Unsplash access key
        }
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            return {
                'url': data['urls']['regular'],
                'credit': {
                    'name': data['user']['name'],
                    'link': data['user']['links']['html']
                }
            }
    except Exception as e:
        print(f"Error fetching Unsplash image: {e}")
    
    # Fallback to a default image if Unsplash fails
    return {
        'url': f"https://source.unsplash.com/random/800x600/?{query}",
        'credit': {
            'name': 'Unsplash',
            'link': 'https://unsplash.com'
        }
    }

def extract_year(date_str):
    """Extract year from various date formats"""
    if not date_str:
        return None
    
    # Handle Firebase Timestamp objects
    if hasattr(date_str, '_seconds'):
        return datetime.fromtimestamp(date_str._seconds).year
    
    # Handle string dates
    if isinstance(date_str, str):
        match = re.search(r'\b(20\d{2})\b', date_str)
        return int(match.group(1)) if match else None
    
    # Handle datetime objects
    if isinstance(date_str, datetime):
        return date_str.year
    
    return None

def get_project_category(tech_stack):
    """Determine project category based on technologies used"""
    tech_lower = tech_stack.lower()
    if 'api' in tech_lower or 'rest' in tech_lower:
        return 'Backend Development'
    elif 'react' in tech_lower or 'vue' in tech_lower or 'css' in tech_lower:
        return 'Frontend Development'
    elif 'pygame' in tech_lower or 'game' in tech_lower:
        return 'Game Development'
    elif 'flask' in tech_lower or 'django' in tech_lower:
        return 'Full Stack Development'
    return 'Software Development'

def standardize_project(project):
    """Standardize project data structure"""
    title = project.get('title', '')
    tech_stack = project.get('technologies', '')
    
    # Generate search terms for image based on project type
    image_search_terms = {
        'Backend Development': 'server,api,database',
        'Frontend Development': 'website,interface,ui',
        'Game Development': f"{title.lower()},game,gaming",
        'Full Stack Development': 'web,application,fullstack',
        'Software Development': 'software,programming,code'
    }
    
    category = get_project_category(tech_stack)
    image_query = image_search_terms.get(category, 'programming')
    
    # Get or generate cover image
    current_cover = project.get('coverImage')
    if isinstance(current_cover, dict) and 'url' in current_cover:
        cover_image = current_cover
    elif isinstance(current_cover, str) and current_cover:
        cover_image = {'url': current_cover}
    else:
        cover_image = get_unsplash_image(image_query)
    
    # Handle gallery images
    gallery = project.get('gallery', [])
    if gallery:
        new_gallery = []
        for img in gallery:
            if isinstance(img, dict) and 'url' in img:
                new_gallery.append(img)
            elif isinstance(img, str) and img:
                new_gallery.append({'url': img})
        if not new_gallery:
            new_gallery = [cover_image]  # Use cover image if no valid gallery images
    else:
        new_gallery = [cover_image]  # Use cover image if no gallery
    
    # Get the year
    year = None
    if project.get('year'):
        year = project['year']
    elif project.get('date_built'):
        year = extract_year(project['date_built'])
    elif project.get('date'):
        year = extract_year(project['date'])
    
    if not year:
        year = 2024  # Default to current year if no year found
    
    return {
        'title': title,
        'description': project.get('description', ''),
        'role': project.get('role', 'Developer'),
        'technologies': tech_stack,
        'category': category,
        'status': project.get('status', 'Completed'),
        'featured': project.get('featured', False),
        'year': year,
        'github_url': project.get('github_url', ''),
        'coverImage': cover_image,
        'gallery': new_gallery,
        'details': project.get('details', project.get('description', '')),
        'created_at': project.get('created_at', datetime.now()),
        'updated_at': datetime.now()
    }

def update_all_projects():
    """Update all projects with standardized schema"""
    docs = db.collection('projects').stream()
    updated_count = 0
    
    for doc in docs:
        project = doc.to_dict()
        updated_project = standardize_project(project)
        
        # Update the document
        db.collection('projects').document(doc.id).set(updated_project)
        updated_count += 1
        print(f"Updated project: {updated_project['title']}")
    
    print(f"\nSuccessfully updated {updated_count} projects")

if __name__ == "__main__":
    update_all_projects()
