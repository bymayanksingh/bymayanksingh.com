import firebase_admin
from firebase_admin import credentials, firestore
import json
from datetime import datetime

# Initialize Firebase Admin, You'll need to update this
cred = credentials.Certificate('')
firebase_admin.initialize_app(cred)

db = firestore.client()

def import_data(filename):
    """Import data from JSON file to Firestore."""
    try:
        with open(filename, 'r') as f:
            data = json.load(f)
        
        # Iterate through each collection
        for collection_name, collection_data in data.items():
            print(f"Importing collection: {collection_name}")
            collection_ref = db.collection(collection_name)
            
            # Iterate through each document in the collection
            for doc_id, doc_data in collection_data.items():
                print(f"Importing document: {doc_id}")
                
                # Convert ISO format strings back to datetime if needed
                for key, value in doc_data.items():
                    if isinstance(value, str) and 'T' in value:
                        try:
                            doc_data[key] = datetime.fromisoformat(value)
                        except ValueError:
                            pass  # Not a valid datetime string, leave as is
                
                # Set the document with merge=True to avoid overwriting existing data
                collection_ref.document(doc_id).set(doc_data, merge=True)
        
        print("Import completed successfully!")
        
    except Exception as e:
        print(f"Error during import: {str(e)}")

if __name__ == "__main__":
    # You can specify the export file to import
    import_data("firebase_export_20241209_125159.json")
