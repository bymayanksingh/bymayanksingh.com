import firebase_admin
from firebase_admin import credentials, firestore
import os
import re
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Firebase Admin
cred = credentials.Certificate(os.getenv('FIREBASE_ADMIN_SDK_PATH'))
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()

def create_slug(title):
    """Create a URL-friendly slug from a title."""
    # Convert to lowercase and replace spaces with hyphens
    slug = title.lower().strip()
    # Remove special characters
    slug = re.sub(r'[^\w\s-]', '', slug)
    # Replace spaces with hyphens
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug

def update_project_slugs():
    # Get all projects
    projects_ref = db.collection('projects')
    projects = projects_ref.get()
    
    for project in projects:
        project_data = project.to_dict()
        
        # Create slug if it doesn't exist
        if 'slug' not in project_data or not project_data['slug']:
            title = project_data.get('title', '')
            if title:
                new_slug = create_slug(title)
                
                # Update the document with the new slug
                project.reference.update({
                    'slug': new_slug,
                    'updated_at': firestore.SERVER_TIMESTAMP
                })
                print(f"Updated project '{title}' with slug: {new_slug}")
            else:
                print(f"Warning: Project {project.id} has no title")
        else:
            print(f"Project '{project_data.get('title', '')}' already has slug: {project_data['slug']}")

if __name__ == "__main__":
    update_project_slugs()
    print("Finished updating project slugs")
