import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import difflib
import re

# Initialize Firebase Admin SDK
cred = credentials.Certificate('/Users/admin/Downloads/bymayanksingh-firebase-adminsdk-jmdt5-f612894ec8.json')
firebase_admin.initialize_app(cred)
db = firestore.client()

def normalize_title(title):
    """Normalize title for comparison"""
    # Convert numbers to words and words to numbers
    number_word_map = {
        '0': 'zero', '1': 'one', '2': 'two', '3': 'three', '4': 'four',
        '5': 'five', '6': 'six', '7': 'seven', '8': 'eight', '9': 'nine',
        'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
        'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9'
    }
    
    # Convert to lowercase and remove special characters
    title = re.sub(r'[^\w\s]', '', title.lower().strip())
    
    # Handle special cases like "Connect4"
    title = re.sub(r'(\w+)(\d+)', r'\1 \2', title)  # Split words and numbers
    
    # Split into words
    words = title.split()
    normalized = []
    
    for word in words:
        # Convert numbers to words
        if word.isdigit():
            word = number_word_map.get(word, word)
        # Convert number words to numbers
        elif word in number_word_map:
            word = number_word_map[word]
        # Remove common words
        if word not in {'a', 'an', 'the', 'and', 'or', 'but', 'game'}:
            normalized.append(word)
    
    return ' '.join(normalized)

def get_similarity_ratio(str1, str2):
    """Calculate similarity ratio between two strings"""
    norm1 = normalize_title(str1)
    norm2 = normalize_title(str2)
    print(f"Comparing normalized titles: '{norm1}' vs '{norm2}'")
    return difflib.SequenceMatcher(None, norm1, norm2).ratio()

def merge_projects(projects):
    """Merge similar projects and return merged projects and projects to delete"""
    merged = {}
    to_delete = set()
    
    # First pass: Group by normalized title matches
    for project in projects:
        title = project.get('title', '').strip()
        if not title:
            continue
            
        norm_title = normalize_title(title)
        if norm_title not in merged:
            merged[norm_title] = project
        else:
            print(f"Found exact match after normalization: '{title}' matches '{merged[norm_title]['title']}'")
            # Merge data, keeping the most complete information
            base = merged[norm_title]
            for key, value in project.items():
                if key not in base or (not base[key] and value):
                    base[key] = value
            to_delete.add(project['id'])
    
    # Second pass: Find similar titles
    titles = list(merged.keys())
    for i in range(len(titles)):
        for j in range(i + 1, len(titles)):
            similarity = get_similarity_ratio(titles[i], titles[j])
            if similarity > 0.7:  # Lower threshold to catch more cases
                print(f"Found similar titles: '{merged[titles[i]]['title']}' and '{merged[titles[j]]['title']}' (similarity: {similarity:.2f})")
                # Keep the more complete project
                proj1 = merged[titles[i]]
                proj2 = merged[titles[j]]
                
                # Compare completeness (number of non-empty fields)
                completeness1 = sum(1 for v in proj1.values() if v)
                completeness2 = sum(1 for v in proj2.values() if v)
                
                if completeness1 >= completeness2:
                    # Merge proj2 into proj1
                    for key, value in proj2.items():
                        if key not in proj1 or (not proj1[key] and value):
                            proj1[key] = value
                    to_delete.add(proj2['id'])
                    del merged[titles[j]]
                    print(f"Merged '{proj2['title']}' into '{proj1['title']}'")
                else:
                    # Merge proj1 into proj2
                    for key, value in proj1.items():
                        if key not in proj2 or (not proj2[key] and value):
                            proj2[key] = value
                    to_delete.add(proj1['id'])
                    del merged[titles[i]]
                    print(f"Merged '{proj1['title']}' into '{proj2['title']}'")
                break
    
    return list(merged.values()), list(to_delete)

def main():
    # Get all projects
    projects_ref = db.collection('projects')
    projects = []
    for doc in projects_ref.stream():
        project_data = doc.to_dict()
        project_data['id'] = doc.id
        projects.append(project_data)
        print(f"Found project: {project_data['title']} (ID: {doc.id})")
    
    print(f"\nFound {len(projects)} projects")
    
    # Merge similar projects
    merged_projects, to_delete = merge_projects(projects)
    
    print(f"\nMerged into {len(merged_projects)} projects")
    print(f"Projects to delete: {len(to_delete)}")
    
    if to_delete:
        print("\nProjects that will be deleted:")
        for project in projects:
            if project['id'] in to_delete:
                print(f"- {project['title']} (ID: {project['id']})")
        
        # Update Firebase
        batch = db.batch()
        
        # Update merged projects
        for project in merged_projects:
            project_id = project.pop('id')  # Remove id from data
            project['updated_at'] = datetime.now().isoformat()
            doc_ref = projects_ref.document(project_id)
            batch.set(doc_ref, project)
        
        # Delete duplicate projects
        for project_id in to_delete:
            doc_ref = projects_ref.document(project_id)
            batch.delete(doc_ref)
        
        # Commit the batch
        batch.commit()
        print("\nSuccessfully updated Firebase!")
    else:
        print("\nNo changes needed in Firebase.")

if __name__ == "__main__":
    main()
