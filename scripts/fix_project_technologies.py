import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Firebase Admin
cred = credentials.Certificate(os.getenv('FIREBASE_ADMIN_SDK_PATH'))
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

db = firestore.client()

def fix_project_technologies():
    # Get all projects
    projects_ref = db.collection('projects')
    projects = projects_ref.get()
    
    for project in projects:
        project_data = project.to_dict()
        
        # Fix technologies field
        technologies = project_data.get('technologies', [])
        if not isinstance(technologies, list):
            if isinstance(technologies, str) and technologies:
                # If it's a non-empty string, try to split it
                new_technologies = [tech.strip() for tech in technologies.split(',')]
            else:
                new_technologies = []
            
            # Update the document with the fixed technologies array
            project.reference.update({
                'technologies': new_technologies,
                'updated_at': firestore.SERVER_TIMESTAMP
            })
            print(f"Updated project '{project_data.get('title', '')}' technologies: {new_technologies}")
        else:
            print(f"Project '{project_data.get('title', '')}' technologies already correct: {technologies}")

if __name__ == "__main__":
    fix_project_technologies()
    print("Finished fixing project technologies")
