import firebase_admin
from firebase_admin import credentials, firestore
import json
from datetime import datetime

# Initialize Firebase Admin
cred = credentials.Certificate('')  # Updated service account path
firebase_admin.initialize_app(cred)

db = firestore.client()

def get_all_collections():
    """Get all collections from Firestore."""
    collections = db.collections()
    return [collection.id for collection in collections]

def get_collection_data(collection_name):
    """Get all documents from a collection."""
    docs = db.collection(collection_name).stream()
    collection_data = {}
    
    for doc in docs:
        doc_dict = doc.to_dict()
        # Convert any non-serializable objects to strings
        for key, value in doc_dict.items():
            if isinstance(value, datetime):
                doc_dict[key] = value.isoformat()
        collection_data[doc.id] = doc_dict
    
    return collection_data

def export_data():
    """Export all collections and their data."""
    all_data = {}
    collections = get_all_collections()
    
    for collection in collections:
        print(f"Exporting collection: {collection}")
        all_data[collection] = get_collection_data(collection)
    
    # Save to a JSON file with timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f'firebase_export_{timestamp}.json'
    
    with open(filename, 'w') as f:
        json.dump(all_data, f, indent=2)
    
    print(f"Export completed. Data saved to {filename}")

if __name__ == "__main__":
    export_data()
