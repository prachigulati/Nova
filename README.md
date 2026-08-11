# Nova: Campus Companion AI 🚀

Nova is an advanced, voice-enabled campus companion designed to bridge the gap between students and university data. It acts as a unified, intelligent agent that handles academic tracking, timetable lookups, leave requests, and real-time document intelligence.


## 📌 The Problem
University life for students is often bogged down by a maze of administrative hurdles and scattered information. Students waste countless hours tracking mandatory 75% attendance thresholds, digging through daily class timetables, navigating rigid leave application policies, and searching through dozens of unstructured teacher-uploaded PDF circulars, exam notices, and job bootcamps spread across disconnected portals. 

## 🎯 Use Case
Nova acts as a unified, conversational assistant designed for university students to manage their academic lifecycle effortlessly. Common use cases include:
* Checking placement eligibility based on minimum CGPA criteria.
* Identifying past semester subjects requiring academic improvement.
* Tracking subject-wise attendance and pinpointing specific missed lectures.
* Executing multi-step medical leave applications with automated policy validation and document verification.
* Querying newly uploaded teacher circulars and bootcamp notices in real time.

## 💡 The Solution
**Nova** is an intelligent, voice-enabled campus companion that consolidates all university operations into a single conversational interface. Powered by advanced **Agentic AI**, **LLMs**, and **Transformers**, Nova replaces rigid, hardcoded menus with dynamic intent routing. Powered by advanced agentic workflows, RAG, and MCP servers, Nova successfully unifies academic tracking, live document intelligence, and multi-step workflows into a single conversational assistant.


## ✨ Key Features

* **Courses**: View active subjects, instructor details, and curriculum progression.
* **Performance & Transcripts**: Monitor CGPA, SGPA, credit distributions, and download complete official academic transcripts instantly as a PDF.
* **Schedule**: Track daily class timetables, lecture timings, and room allocations.
* **Attendance**: Keep tabs on class attendance percentages against the mandatory 75% institutional threshold.
* **Leaves**: Enforce strict policy validation rules, check date constraints, and trigger medical prescription verification workflows.
* **Timeline**: Query campus notices, announcements, and teacher-uploaded PDF files live.
* **Profile**: Securely manage authenticated student metadata and department information.
* **Assistant / Voice Mode**: Experience real-time speech synthesis, live listening toggles, voice-mute controls, and quick prompt chips for effortless interaction.


## 🛠️ Technical Architecture & Stack

* **Agentic Framework & Routing**: Powered by a **FastAPI** backend and **LangGraph** state management, using contextual system prompts for dynamic tool-calling intent routing rather than rigid rules.
* **Retrieval-Augmented Generation (RAG) & MCP**: Features an integrated **Model Context Protocol (MCP)** server architecture (`document_mcp_server.py`) to securely read, parse, and query unstructured teacher-uploaded PDF documents and circulars in real time.
* **Zero-Hallucination Grounding**: Every feature response is strictly verified against backend JSON records and database states for absolute reliability.
* **Frontend**: Built with **React** (`my-dashboard/`), utilizing a modern UI layout featuring Tailwind CSS and Lucide icons.


## 📊 Evaluation & Safety Guardrails
* To ensure production-grade reliability, security, and zero hallucinations, Nova includes a rigorous automated evaluation and safety architecture:

* LLM-as-Judge Evaluation Pipeline (eval/run_eval.py): Automatically tests Nova against a 20-item golden dataset (eval/golden_dataset.json), measuring performance across Faithfulness, Tool-Call Accuracy, and Clarification Handling.

* Production Guardrails (app/guardrails.py): Protects the agent at runtime using specialized safety classifiers that intercept prompt injections, scope bypasses, and unverified data leaks on both inputs and outputs.



## 📂 Project Structure

```text
CampusCompanionAI/
├── app/
│   ├── agent.py            # LangGraph agent setup & routing
│   ├── database.py         # Database connection & handlers
|   ├──guardrails.py       # Input and output safety filter checks
│   ├── main.py             # FastAPI application entry point
│   ├── rag.py              # RAG pipeline logic
│   └── tools.py            # Backend tool definitions
├── data/                   # JSON storage for attendance, courses, performance, etc.
├── docs/                   # Institutional guidelines & policy files
├── eval/                   # Automated testing suite
│   ├── build_golden.py     # Golden dataset generator
│   ├── golden_dataset.json # 20-item evaluation test cases
│   └── run_eval.py         # LLM-as-judge evaluation script
├── my-dashboard/           # React frontend client dashboard
├── teacher_uploads/        # Directory for teacher-uploaded PDF resources
├── uploads/                # Student-submitted attachments (prescriptions, resumes, etc.)
└── document_mcp_server.py  # Model Context Protocol server for live PDF parsing

```

## 🚀 Getting Started

### 1. Backend Setup
Navigate to the root directory and start the FastAPI server:

```bash
uvicorn app.main:app --reload

```

### 2. Frontend Setup
Navigate to the dashboard directory, install dependencies, and start the React client:

```bash
cd my-dashboard
npm install
npm start
```
## 📝 License
This project is open-source.
