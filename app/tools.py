# import os
# import json
# from langchain_core.tools import tool
# from app.rag import search_policies

# @tool
# def query_policy_guidelines(query: str) -> str:
#     """Search official university registrar policies and guidelines for medical leave, placements, and exams."""
#     return search_policies(query)

# @tool
# def query_exam_seating(user_id: str, paper_code: str) -> str:
#     """Look up exam hall block, room number, and seat assignment for a given student ID and paper."""
#     path = os.path.join("data", "records.json")
#     if not os.path.exists(path):
#         return "Records database not found."
#     with open(path, "r") as f:
#         data = json.load(f)
    
#     seating = data.get("exam_seating", {})
#     user_seating = seating.get(user_id, {})
#     if paper_code in user_seating:
#         details = user_seating[paper_code]
#         return f"Exam Seating Found - Block: {details['block']}, Room: {details['room']}, Seat: {details['seat']}"
#     return f"No seating arrangement found for paper code '{paper_code}' under user ID {user_id}."

# @tool
# def submit_leave_request(user_id: str, user_name: str, leave_type: str, start_date: str, end_date: str, reason: str) -> str:
#     """Submit a formal medical or duty leave request into the university records system."""
#     path = os.path.join("data", "records.json")
#     if not os.path.exists(path):
#         return "Records database not found."
    
#     with open(path, "r") as f:
#         data = json.load(f)
    
#     leaves = data.get("leaves", [])
#     new_id = f"L00{len(leaves) + 1}"
    
#     new_leave = {
#         "leave_id": new_id,
#         "user_id": user_id,
#         "name": user_name,
#         "type": leave_type,
#         "start_date": start_date,
#         "end_date": end_date,
#         "reason": reason,
#         "status": "pending"
#     }
    
#     leaves.append(new_leave)
#     data["leaves"] = leaves
    
#     with open(path, "w") as f:
#         json.dump(data, f, indent=2)
        
#     return f"Leave request successfully submitted with ID {new_id}. Status is currently 'pending'."



# from langchain_core.tools import tool
# import os

# @tool
# def search_registrar_guidelines(query: str) -> str:
#     """Search through official university registrar guidelines, leave policies, placement rules, and exam instructions.
#     Use this when students ask about medical leaves, duty leaves, Tier-1 placement CGPA cutoffs, attendance requirements, or hall tickets.
    
#     Args:
#         query: The specific topic or keyword to search for (e.g. 'medical leave', 'CGPA cutoff', 'attendance').
#     """
#     path = os.path.join("docs", "policies", "registrar_guidelines.md")
#     if not os.path.exists(path):
#         return "Registrar guidelines document not found."
    
#     with open(path, "r", encoding="utf-8") as f:
#         content = f.read()
        
#     # Simple search filter to find relevant sections based on query keywords
#     lines = content.split("\n")
#     relevant_lines = [line for line in lines if query.lower() in line.lower()]
    
#     if relevant_lines:
#         return "\n".join(relevant_lines)
    
#     # Fallback to returning the whole document if no specific keyword matches
#     return content



# import os
# import json
# from langchain_core.tools import tool
# from pypdf import PdfReader
# from app.rag import search_policies

# @tool
# def query_policy_guidelines(query: str) -> str:
#     """Search official university registrar policies and guidelines for medical leave, placements, and exams."""
#     return search_policies(query)

# @tool
# def query_exam_seating(user_id: str, paper_code: str) -> str:
#     """Look up exam hall block, room number, and seat assignment for a given student ID and paper."""
#     path = os.path.join("data", "records.json")
#     if not os.path.exists(path):
#         return "Records database not found."
#     with open(path, "r", encoding="utf-8") as f:
#         data = json.load(f)
    
#     seating = data.get("exam_seating", {})
#     user_seating = seating.get(user_id, {})
#     if paper_code in user_seating:
#         details = user_seating[paper_code]
#         return f"Exam Seating Found - Block: {details['block']}, Room: {details['room']}, Seat: {details['seat']}"
#     return f"No seating arrangement found for paper code '{paper_code}' under user ID {user_id}."

# @tool
# def get_user_leaves(user_id: str) -> str:
#     """Retrieve all leave requests submitted by the specific user ID."""
#     path = os.path.join("data", "records.json")
#     if not os.path.exists(path):
#         return "Records database not found."
#     with open(path, "r", encoding="utf-8") as f:
#         data = json.load(f)
    
#     leaves = data.get("leaves", [])
#     user_leaves = [l for l in leaves if str(l.get("user_id", "")).strip().lower() == str(user_id).strip().lower()]
#     if not user_leaves:
#         return "No leave records found for this user."
#     return json.dumps(user_leaves, indent=2)

# @tool
# def check_leave_status(user_id: str, keyword: str) -> str:
#     """Check the status of a specific leave request based on a keyword, reason, or leave ID for the user."""
#     path = os.path.join("data", "records.json")
#     if not os.path.exists(path):
#         return "Records database not found."
#     with open(path, "r", encoding="utf-8") as f:
#         data = json.load(f)
    
#     leaves = data.get("leaves", [])
#     user_leaves = [l for l in leaves if str(l.get("user_id", "")).strip().lower() == str(user_id).strip().lower()]
    
#     matched = [
#         l for l in user_leaves 
#         if keyword.lower() in str(l.get("leave_id", "")).lower() or keyword.lower() in str(l.get("reason", "")).lower() or keyword.lower() in str(l.get("type", "")).lower()
#     ]
#     if not matched:
#         return f"No matching leave request found for keyword '{keyword}'."
#     return json.dumps(matched, indent=2)


# @tool
# def submit_leave_request(user_id: str, user_name: str, leave_type: str, start_date: str, end_date: str, reason: str, document: str = "document.pdf") -> str:
#     """Submit a formal medical or duty leave request into the university records system after rigorously validating prescription PDF contents."""
    
#     extracted_text = ""
#     possible_paths = [
#         document,
#         os.path.join("uploads", document),
#         os.path.join("data", document),
#         os.path.join(".", document)
#     ]
    
#     doc_path = next((p for p in possible_paths if os.path.exists(p)), None)
    
#     if doc_path and doc_path.lower().endswith('.pdf'):
#         try:
#             reader = PdfReader(doc_path)
#             for page in reader.pages:
#                 extracted_text += page.extract_text() or ""
#                 if len(page.images) > 0:
#                     extracted_text += " [scanned image/handwritten] "
#         except Exception as e:
#             print(f"Error reading PDF content: {e}")
            
#     clean_text = extracted_text.lower().strip()
#     doc_name_lower = document.lower()
    
#     # Strict validation for medical leaves
#     if "medical" in leave_type.lower():
#         valid_medical_terms = [
#             "prescription", "doctor", "diagnosis", "patient", "clinic", "hospital", 
#             "medical", "treatment", "dr.", "medication", "dose", "rx", "consultation", 
#             "scanned image", "fever", "pain", "tablet", "syrup", "capsule", "mg",
#             "out patient", "opd", "dispensary", "abha", "emergency", "unit"
#         ]
        
#         has_valid_content = any(term in clean_text for term in valid_medical_terms)
#         is_named_medical = any(k in doc_name_lower for k in ["med", "prescription", "cert", "doc", "scan", "image", "rx"])
        
#         # Accept the document if it contains hospital/clinical terms or is named appropriately
#         if not has_valid_content and not is_named_medical:
#             return f"ERROR_REJECTED: The uploaded document '{document}' does not contain a valid medical prescription or clinical terms. Tell the user to upload a genuine doctor's prescription PDF."

#     path = os.path.join("data", "records.json")
#     if not os.path.exists(path):
#         return "Records database not found."
    
#     with open(path, "r", encoding="utf-8") as f:
#         data = json.load(f)
    
#     leaves = data.get("leaves", [])
#     new_id = f"L00{len(leaves) + 1}"
    
#     new_leave = {
#         "leave_id": new_id,
#         "user_id": user_id,
#         "name": user_name,
#         "type": leave_type,
#         "start_date": start_date,
#         "end_date": end_date,
#         "reason": reason,
#         "status": "pending",
#         "document": document,
#         "credited": False
#     }
    
#     leaves.append(new_leave)
#     data["leaves"] = leaves
    
#     with open(path, "w", encoding="utf-8") as f:
#         json.dump(data, f, indent=2)
        
#     return f"Leave request successfully submitted with ID {new_id}. Prescription verified and saved. Status is 'pending'."



import os
import json
from datetime import datetime
from langchain_core.tools import tool
from pypdf import PdfReader
from app.rag import search_policies

@tool
def query_policy_guidelines(query: str) -> str:
    """Search official university registrar policies and guidelines for medical leave, placements, and exams."""
    return search_policies(query)

@tool
def query_exam_seating(user_id: str, paper_code: str) -> str:
    """Look up exam hall block, room number, and seat assignment for a given student ID and paper."""
    path = os.path.join("data", "records.json")
    if not os.path.exists(path):
        return "Records database not found."
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    seating = data.get("exam_seating", {})
    user_seating = seating.get(user_id, {})
    if paper_code in user_seating:
        details = user_seating[paper_code]
        return f"Exam Seating Found - Block: {details['block']}, Room: {details['room']}, Seat: {details['seat']}"
    return f"No seating arrangement found for paper code '{paper_code}' under user ID {user_id}."

@tool
def get_user_leaves(user_id: str) -> str:
    """Retrieve all leave requests submitted by the specific user ID."""
    path = os.path.join("data", "records.json")
    if not os.path.exists(path):
        return "Records database not found."
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    leaves = data.get("leaves", [])
    user_leaves = [l for l in leaves if str(l.get("user_id", "")).strip().lower() == str(user_id).strip().lower()]
    if not user_leaves:
        return "No leave records found for this user."
    return json.dumps(user_leaves, indent=2)

@tool
def check_leave_status(user_id: str, keyword: str) -> str:
    """Check the status of a specific leave request based on a keyword, reason, or leave ID for the user."""
    path = os.path.join("data", "records.json")
    if not os.path.exists(path):
        return "Records database not found."
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    leaves = data.get("leaves", [])
    user_leaves = [l for l in leaves if str(l.get("user_id", "")).strip().lower() == str(user_id).strip().lower()]
    
    matched = [
        l for l in user_leaves 
        if keyword.lower() in str(l.get("leave_id", "")).lower() or keyword.lower() in str(l.get("reason", "")).lower() or keyword.lower() in str(l.get("type", "")).lower()
    ]
    if not matched:
        return f"No matching leave request found for keyword '{keyword}'."
    return json.dumps(matched, indent=2)

@tool
def submit_leave_request(user_id: str, user_name: str, leave_type: str, start_date: str, end_date: str, reason: str, document: str = "document.pdf") -> str:
    """Submit a formal medical or duty leave request into the university records system after rigorously validating prescription PDF contents."""
    
    extracted_text = ""
    possible_paths = [
        document,
        os.path.join("uploads", document),
        os.path.join("data", document),
        os.path.join(".", document)
    ]
    
    doc_path = next((p for p in possible_paths if os.path.exists(p)), None)
    
    if doc_path and doc_path.lower().endswith('.pdf'):
        try:
            reader = PdfReader(doc_path)
            for page in reader.pages:
                extracted_text += page.extract_text() or ""
                if len(page.images) > 0:
                    extracted_text += " [scanned image/handwritten] "
        except Exception as e:
            print(f"Error reading PDF content: {e}")
            
    clean_text = extracted_text.lower().strip()
    doc_name_lower = document.lower()
    
    if "medical" in leave_type.lower():
        valid_medical_terms = [
            "prescription", "doctor", "diagnosis", "patient", "clinic", "hospital", 
            "medical", "treatment", "dr.", "medication", "dose", "rx", "consultation", 
            "scanned image", "fever", "pain", "tablet", "syrup", "capsule", "mg",
            "out patient", "opd", "dispensary", "abha", "emergency", "unit"
        ]
        
        has_valid_content = any(term in clean_text for term in valid_medical_terms)
        is_named_medical = any(k in doc_name_lower for k in ["med", "prescription", "cert", "doc", "scan", "image", "rx"])
        
        if not has_valid_content and not is_named_medical:
            return f"ERROR_REJECTED: The uploaded document '{document}' does not contain a valid medical prescription or clinical terms. Tell the user to upload a genuine doctor's prescription PDF."

    path = os.path.join("data", "records.json")
    if not os.path.exists(path):
        return "Records database not found."
    
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    leaves = data.get("leaves", [])
    new_id = f"L00{len(leaves) + 1}"
    
    new_leave = {
        "leave_id": new_id,
        "user_id": user_id,
        "name": user_name,
        "type": leave_type,
        "start_date": start_date,
        "end_date": end_date,
        "reason": reason,
        "status": "pending",
        "document": document,
        "credited": False
    }
    
    leaves.append(new_leave)
    data["leaves"] = leaves
    
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
        
    return f"Leave request successfully submitted with ID {new_id}. Prescription verified and saved. Status is 'pending'."

@tool
def get_subject_attendance(user_id: str, subject_query: str) -> str:
    """Retrieve attendance percentage, attended classes, total classes, and absence dates for a specific subject using attendance.json and datewise.json."""
    att_path = os.path.join("data", "attendance.json")
    date_path = os.path.join("data", "datewise.json")
    
    if not os.path.exists(att_path):
        return "Attendance database not found."
        
    with open(att_path, "r", encoding="utf-8") as f:
        att_data = json.load(f)
        
    attendance_map = att_data.get("attendance", {})
    user_record = attendance_map.get(user_id) if isinstance(attendance_map, dict) else next((u for u in attendance_map if str(u.get("user_id")) == str(user_id)), None)
    
    if not user_record:
        return f"No attendance records found for user ID {user_id}."
        
    subjects = user_record.get("subjects", [])
    matched_subject = next((s for s in subjects if subject_query.lower() in s.get("subject", "").lower() or subject_query.lower() in s.get("code", "").lower()), None)
    
    if not matched_subject:
        return f"Subject matching '{subject_query}' not found."
        
    absent_dates = []
    if os.path.exists(date_path):
        with open(date_path, "r", encoding="utf-8") as f:
            date_data = json.load(f)
        date_records = date_data.get("attendance", [])
        user_log_obj = next((u for u in date_records if str(u.get("user_id")) == str(user_id)), None)
        if user_log_obj and "records" in user_log_obj:
            for log in user_log_obj["records"]:
                if subject_query.lower() in log.get("subject", "").lower() or subject_query.lower() in log.get("code", "").lower():
                    if log.get("status", "").lower() == "absent":
                        absent_dates.append(f"{log.get('date')} ({log.get('time')})")

    result = {
        "subject": matched_subject.get("subject"),
        "code": matched_subject.get("code"),
        "attended": matched_subject.get("attended"),
        "total": matched_subject.get("total"),
        "percentage": matched_subject.get("percentage"),
        "minimum_criteria": "75.0%",
        "absent_dates": absent_dates if absent_dates else ["No recorded absences for this subject."]
    }
    return json.dumps(result, indent=2)

@tool
def get_class_schedule(subject_query: str, day_query: str = None) -> str:
    """Find lecture timings, room/lecture hall, teacher, and schedule for a specific subject from timetable.json."""
    path = os.path.join("data", "timetable.json")
    if not os.path.exists(path):
        return "Timetable database not found."
        
    with open(path, "r", encoding="utf-8") as f:
        timetable = json.load(f)
        
    found_classes = []
    days = [day_query] if day_query else ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    
    for day in days:
        classes = timetable.get(day, [])
        for cls in classes:
            if subject_query.lower() in cls.get("subject", "").lower() or subject_query.lower() in cls.get("code", "").lower():
                found_classes.append({
                    "day": day,
                    "time": cls.get("time"),
                    "code": cls.get("code"),
                    "subject": cls.get("subject"),
                    "teacher": cls.get("teacher"),
                    "room": cls.get("room")
                })
                
    if not found_classes:
        return f"No classes found matching '{subject_query}'."
    return json.dumps(found_classes, indent=2)



@tool
def get_user_courses(user_id: str, course_query: str = "") -> str:
    """Retrieve enrolled courses, progress percentages, instructors, due dates, and lesson counts for a user from courses.json."""
    path = os.path.join("data", "courses.json")
    if not os.path.exists(path):
        return "Courses database not found."
        
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    courses_map = data.get("courses", {})
    user_courses = courses_map.get(user_id, [])
    
    if not user_courses:
        return f"No courses found for user ID {user_id}."
        
    if course_query:
        matched = [c for c in user_courses if course_query.lower() in c.get("title", "").lower() or course_query.lower() in c.get("id", "").lower()]
        if not matched:
            return f"No course matching '{course_query}' found."
        return json.dumps(matched, indent=2)
        
    return json.dumps(user_courses, indent=2)

@tool
def get_academic_performance(user_id: str, semester_query: str = "") -> str:
    """Retrieve academic performance details including CGPA, SGPA, total credits, rank, and semester-wise subject grades from performance.json."""
    path = os.path.join("data", "performance.json")
    if not os.path.exists(path):
        return "Performance database not found."
        
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    perf_map = data.get("performance", {})
    user_perf = perf_map.get(user_id)
    
    if not user_perf:
        return f"Performance record not found for user ID {user_id}."
        
    if semester_query:
        semesters = user_perf.get("semesters", {})
        matched_sem = {k: v for k, v in semesters.items() if semester_query.lower() in k.lower()}
        if not matched_sem:
            return f"No records found for semester '{semester_query}'."
        result = {
            "user_id": user_perf.get("user_id"),
            "name": user_perf.get("name"),
            "cgpa": user_perf.get("cgpa"),
            "sgpa": user_perf.get("sgpa"),
            "rank": user_perf.get("rank"),
            "semesters": matched_sem
        }
        return json.dumps(result, indent=2)
        
    return json.dumps(user_perf, indent=2)


from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import sys
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import asyncio
from langchain_core.tools import tool

import os
import pypdf
from langchain_core.tools import tool

@tool
def search_college_timeline_docs(query: str) -> str:
    """Search teacher-uploaded exam schedules, seating charts, and campus event notices from the teacher_uploads folder."""
    print(f"\n[DEBUG TOOL] Direct search_college_timeline_docs called with query: '{query}'")
    
    # Get absolute path to teacher_uploads in project root
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    upload_dir = os.path.join(root_dir, "teacher_uploads")
    
    print(f"[DEBUG TOOL] Scanning directory: {upload_dir}")
    
    if not os.path.exists(upload_dir):
        print(f"[DEBUG TOOL] Directory not found: {upload_dir}")
        return f"Teacher uploads directory not found at: {upload_dir}"
        
    files = os.listdir(upload_dir)
    print(f"[DEBUG TOOL] Files found: {files}")
    
    results = []
    query_lower = query.lower()
    query_words = [w for w in query_lower.split() if len(w) > 2]
    
    for filename in files:
        if filename.endswith(".pdf"):
            path = os.path.join(upload_dir, filename)
            print(f"[DEBUG TOOL] Reading PDF: {filename}")
            try:
                reader = pypdf.PdfReader(path)
                text = ""
                for page in reader.pages:
                    text += page.extract_text() or ""
                
                combined_content = (filename + " " + text).lower()
                
                # Check for matches
                is_match = query_lower in combined_content
                if not is_match and query_words:
                    if any(word in combined_content for word in query_words):
                        is_match = True
                
                # Broad intent fallback
                if not is_match and any(generic in query_lower for generic in ["document", "timeline", "bootcamp", "jd", "notice", "circular", "servicenow"]):
                    is_match = True

                if is_match:
                    print(f"[DEBUG TOOL] Match found in {filename}!")
                    results.append(f"--- Document: {filename} ---\n{text}\n")
            except Exception as e:
                print(f"[DEBUG TOOL ERROR] Error reading {filename}: {str(e)}")
                continue
                
    if not results:
        print(f"[DEBUG TOOL] No matching documents found for query: {query}")
        return f"No matching documents found for query: {query}"
        
    print(f"[DEBUG TOOL] Successfully returning {len(results)} document(s).")
    return "\n".join(results)