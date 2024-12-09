import firebase_admin
from firebase_admin import credentials, firestore
import json
from datetime import datetime

# Initialize Firebase Admin
cred = credentials.Certificate('/Users/mayanksingh/Downloads/bymayanksingh-firebase-adminsdk-jmdt5-aa2d3280d4.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

def delete_and_import_projects(filename):
    """Delete all existing projects and import new data from JSON file to Firestore."""
    try:
        # First, delete all existing projects
        projects_ref = db.collection('projects')
        docs = projects_ref.stream()
        deleted_count = 0
        
        print("Deleting existing projects...")
        for doc in docs:
            doc.reference.delete()
            deleted_count += 1
        print(f"Deleted {deleted_count} existing projects")

        # Now import new projects
        print(f"\nImporting new projects from {filename}")
        with open(filename, 'r') as f:
            data = json.load(f)
        
        # Get the projects dictionary from the JSON
        projects_data = data.get('projects', {})
        
        imported_count = 0
        for doc_id, project in projects_data.items():
            # Convert any ISO format strings to datetime if needed
            for key, value in project.items():
                if isinstance(value, str) and 'T' in value:
                    try:
                        project[key] = datetime.fromisoformat(value)
                    except ValueError:
                        pass  # Not a valid datetime string, leave as is
            
            # Add the project to Firestore with the same document ID
            doc_ref = projects_ref.document(doc_id)
            doc_ref.set(project)
            imported_count += 1
            print(f"Imported project: {project.get('title', 'Untitled')} (ID: {doc_id})")
        
        print(f"\nImport completed successfully!")
        print(f"Summary: Deleted {deleted_count} old projects, imported {imported_count} new projects")
        
    except Exception as e:
        print(f"Error during operation: {str(e)}")

if __name__ == "__main__":
    delete_and_import_projects("firebase_export_20241209_150215.json")
