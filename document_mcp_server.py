import asyncio
import os
import pypdf
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent

server = Server("Teacher Documents Server")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "teacher_uploads")

@server.list_tools()
async def handle_list_tools() -> list[Tool]:
    print("[DEBUG MCP] list_tools requested")
    return [
        Tool(
            name="search_teacher_documents",
            description="Search through all teacher-uploaded PDFs in the teacher_uploads folder.",
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The search term, topic, or keyword."
                    }
                },
                "required": ["query"]
            }
        )
    ]

@server.call_tool()
async def handle_call_tool(name: str, arguments: dict) -> list[TextContent]:
    print(f"[DEBUG MCP] call_tool invoked with name: '{name}', args: {arguments}")
    if name != "search_teacher_documents":
        raise ValueError(f"Unknown tool: {name}")
        
    query = arguments.get("query", "").lower()
    print(f"[DEBUG MCP] Target UPLOAD_DIR: {UPLOAD_DIR}")
    
    if not os.path.exists(UPLOAD_DIR):
        print(f"[DEBUG MCP ERROR] Directory does not exist: {UPLOAD_DIR}")
        return [TextContent(type="text", text=f"Teacher uploads directory not found at: {UPLOAD_DIR}")]
        
    files = os.listdir(UPLOAD_DIR)
    print(f"[DEBUG MCP] Files found in directory: {files}")
    
    results = []
    for filename in files:
        if filename.endswith(".pdf"):
            path = os.path.join(UPLOAD_DIR, filename)
            print(f"[DEBUG MCP] Reading PDF file: {path}")
            try:
                reader = pypdf.PdfReader(path)
                text = ""
                for page in reader.pages:
                    text += page.extract_text() or ""
                print(f"[DEBUG MCP] Extracted {len(text)} characters from {filename}")
                
                results.append(f"--- Document: {filename} ---\n{text}\n")
            except Exception as e:
                print(f"[DEBUG MCP ERROR] Failed to read PDF {filename}: {str(e)}")
                continue
                
    if not results:
        print("[DEBUG MCP] No PDF documents found or successfully read.")
        return [TextContent(type="text", text=f"No documents found in {UPLOAD_DIR}.")]
        
    print(f"[DEBUG MCP] Returning {len(results)} document(s) to client.")
    return [TextContent(type="text", text="\n".join(results))]

async def main():
    print("[DEBUG MCP] MCP Server main() started, listening on stdio...")
    async with stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            server.create_initialization_options()
        )

if __name__ == "__main__":
    asyncio.run(main())