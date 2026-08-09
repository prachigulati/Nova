import os
from datetime import datetime
from typing import Annotated, TypedDict
from dotenv import load_dotenv

load_dotenv()

from langchain_core.messages import BaseMessage, HumanMessage, AIMessage, ToolMessage
from langchain_openai import AzureChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver

from app.tools import query_policy_guidelines, query_exam_seating, submit_leave_request, get_user_leaves, check_leave_status, get_class_schedule, get_subject_attendance, get_user_courses, get_academic_performance

class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    user_id: str
    user_name: str
    user_role: str


TOOLS = [
    query_policy_guidelines, 
    query_exam_seating, 
    submit_leave_request, 
    get_user_leaves, 
    check_leave_status, 
    get_subject_attendance, 
    get_class_schedule,
    get_user_courses,
    get_academic_performance
]

model = AzureChatOpenAI(
    azure_deployment=os.getenv("AZURE_OPENAI_CHAT_DEPLOYMENT", "gpt-4o-mini"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION", "2025-01-01-preview"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    temperature=0
).bind_tools(TOOLS)

def call_model(state: AgentState):
    messages = state["messages"]
    user_name = state["user_name"]
    user_role = state["user_role"]
    user_id = state["user_id"]
    
    # Dynamically generate current date and year at runtime
    current_date_str = datetime.now().strftime("%A, %B %d, %Y")
    current_year = datetime.now().strftime("%Y")
    
    current_date_str = datetime.now().strftime("%A, %B %d, %Y")
    current_year = datetime.now().strftime("%Y")

    system_prompt = (
        f"You are Campus Companion AI, an intelligent university assistant. "
        f"You are currently interacting with the logged-in user: {user_name} (ID: {user_id}), Role: '{user_role}'. "
        f"CURRENT DATE CONTEXT: Today is {current_date_str}. Whenever a user provides dates without specifying a year, ALWAYS default to the current year ({current_year}). "
        f"NEVER ask the user for their name or ID; you already have it ({user_id} - {user_name}). Use it automatically in tools. "
        f"CRITICAL FORMATTING & CONCISENESS RULES:\n"
        f"1. DIRECT & CONCISE: Answer strictly what the user asked. DO NOT provide extra information (like absence dates, minimum criteria, or teacher names) unless the user explicitly asks for it.\n"
        f"2. NO MARKDOWN ASTERISKS: Never use markdown bold (**), italics (*), bullet points with asterisks, or hash symbols (#). Speak and write in plain, natural text suitable for voice output.\n"
        f"LEAVE & ATTENDANCE POLICIES & RULES:\n"
        f"1. STEP-BY-STEP LEAVE COLLECTION: You must collect ALL of the following before calling `submit_leave_request`: (a) Leave Type (Medical or Duty), (b) Start Date, (c) End Date, and (d) Reason. If ANY of these four fields are missing—even if a document is uploaded—DO NOT call the tool. Instead, ask the user specifically for what is missing.\n"
        f"2. Date Validation: Leave requests CANNOT be booked for future dates (after today, {current_date_str}). Past and ongoing dates are completely valid.\n"
        f"3. Prescription Policy: For Medical Leaves lasting MORE THAN 3 days, a doctor's prescription PDF is required. When submitting a medical leave, always pass the uploaded document name to `submit_leave_request` so the system can verify it.\n"
        f"4. Leave Queries: When users ask to list their leaves, use `get_user_leaves` with their user ID ({user_id}). When users ask about the status of a specific leave, use `check_leave_status` with their user ID ({user_id}).\n"
        f"5. ATTENDANCE & TIMETABLE TOOLS:\n"
        f"   - Minimum attendance criteria is 75.0%.\n"
        f"   - When users ask about their attendance or percentage for a subject, use `get_subject_attendance` with user ID ({user_id}).\n"
        f"   - When users ask on which dates they were absent for a subject, use `get_subject_attendance`.\n"
        f"   - When users ask about lecture halls, timings, or schedules, use `get_class_schedule`.\n"
        f"6. COURSES & PERFORMANCE TOOLS:\n"
        f"   - When users ask about course progress, instructors, due dates, or lesson counts, use `get_user_courses` with user ID ({user_id}).\n"
        f"   - When users ask about CGPA, SGPA, rank, total credits, or semester grades, use `get_academic_performance` with user ID ({user_id})."
    )
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        MessagesPlaceholder(variable_name="messages"),
    ])
    
    chained = prompt | model
    response = chained.invoke({"messages": messages})
    return {"messages": [response]}

def should_continue(state: AgentState):
    messages = state["messages"]
    last_message = messages[-1]
    if isinstance(last_message, AIMessage) and last_message.tool_calls:
        return "tools"
    return END

workflow = StateGraph(AgentState)
workflow.add_node("agent", call_model)
workflow.add_node("tools", ToolNode(TOOLS))

workflow.set_entry_point("agent")
workflow.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
workflow.add_edge("tools", "agent")

memory = MemorySaver()
app_graph = workflow.compile(checkpointer=memory)