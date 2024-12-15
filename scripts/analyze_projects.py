import firebase_admin
from firebase_admin import credentials, firestore
import json
from datetime import datetime

# Initialize Firebase Admin
cred = credentials.Certificate('/Users/admin/Downloads/bymayanksingh-firebase-adminsdk-jmdt5-f612894ec8.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

def get_all_projects():
    """Get all projects from Firebase"""
    projects = []
    docs = db.collection('projects').stream()
    
    for doc in docs:
        project = doc.to_dict()
        project['id'] = doc.id
        projects.append(project)
    
    return projects

def analyze_schema(projects):
    """Analyze the schema of all projects"""
    all_fields = set()
    for project in projects:
        all_fields.update(project.keys())
    
    print("\nAll possible fields:", sorted(list(all_fields)))
    
    # Print field coverage
    print("\nField coverage across projects:")
    for field in sorted(list(all_fields)):
        coverage = sum(1 for p in projects if field in p)
        print(f"{field}: {coverage}/{len(projects)} projects")

def save_projects(projects, filename):
    """Save projects to a JSON file for inspection"""
    with open(filename, 'w') as f:
        json.dump(projects, f, indent=2, default=str)

if __name__ == "__main__":
    projects = get_all_projects()
    print(f"\nFound {len(projects)} projects")
    analyze_schema(projects)
    save_projects(projects, 'current_projects.json')
