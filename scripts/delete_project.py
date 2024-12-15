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

def delete_project(project_slug):
    # Get projects collection
    projects_ref = db.collection('projects')
    
    # Query for the project with matching slug
    query = projects_ref.where('slug', '==', project_slug)
    docs = query.get()
    
    # Delete matching documents
    deleted = False
    for doc in docs:
        doc.reference.delete()
        deleted = True
        print(f"Successfully deleted project with slug: {project_slug}")
    
    if not deleted:
        print(f"No project found with slug: {project_slug}")

if __name__ == "__main__":
    # Delete the Color Picker Extension project
    delete_project("color-picker-extension")
