"""
FastAPI backend — LangChain agent with SSE streaming.
Compatible with Vercel AI SDK's useChat() hook on the frontend.
"""
import asyncio
import json
import os
from collections import defaultdict
from typing import AsyncGenerator

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from langchain.memory import ConversationBufferWindowMemory
from pydantic import BaseModel

load_dotenv()

from agents.qa_agent import create_agent   # noqa: E402

# ── App setup ────────────────────────────────────────────────────────────────

app = FastAPI(title="LangChain Agent Chat API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Session memory store ─────────────────────────────────────────────────────
# In production replace this with Redis-backed memory keyed by user session ID.

_session_memories: dict[str, ConversationBufferWindowMemory] = defaultdict(
    lambda: ConversationBufferWindowMemory(
        memory_key="chat_history",
        return_messages=True,
        k=20,          # keep last 20 exchanges — prevents context overflow
    )
)


# ── Request / Response schemas ────────────────────────────────────────────────

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[Message]
    session_id: str = "default"


# ── SSE streaming generator ───────────────────────────────────────────────────

async def stream_agent_response(
    user_message: str,
    session_id: str,
) -> AsyncGenerator[str, None]:
    """
    Runs the LangChain agent and yields SSE-formatted token chunks.
    The Vercel AI SDK expects the format:  data: <token>\n\n
    A final `data: [DONE]\n\n` signals end of stream.
    """
    memory = _session_memories[session_id]
    agent = create_agent(memory)

    try:
        async for event in agent.astream_events(
            {"input": user_message},
            version="v1",
        ):
            kind = event.get("event")

            # Stream LLM token chunks
            if kind == "on_chat_model_stream":
                chunk = event.get("data", {}).get("chunk")
                if chunk and hasattr(chunk, "content"):
                    content = chunk.content
                    # Anthropic returns a list of content blocks
                    if isinstance(content, list):
                        for block in content:
                            if isinstance(block, dict) and block.get("type") == "text":
                                text = block.get("text", "")
                                if text:
                                    yield f"0:{json.dumps(text)}\n"
                            elif isinstance(block, str) and block:
                                yield f"0:{json.dumps(block)}\n"
                    # OpenAI returns a plain string
                    elif isinstance(content, str) and content:
                        yield f"0:{json.dumps(content)}\n"


            # Agent has a tool call — optionally surface this to the UI
            elif kind == "on_tool_start":
                tool_name = event.get("name", "tool")
                status_msg = json.dumps(f"_Using tool: {tool_name}…_\n\n")
                yield f"0:{status_msg}\n"

    except Exception as e:
        error_payload = json.dumps(f"⚠ Agent error: {str(e)}")
        yield f"0:{error_payload}\n"

    finally:
        yield 'd:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n'


# ── Route ─────────────────────────────────────────────────────────────────────

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest) -> StreamingResponse:
    """
    Receives the full message history from useChat(),
    extracts the latest user message, and streams the agent response.
    """
    if not request.messages:
        return StreamingResponse(iter([]), media_type="text/event-stream")

    # useChat sends the full history; the last message is always the user's latest
    last_user_message = next(
        (m.content for m in reversed(request.messages) if m.role == "user"),
        None,
    )

    if not last_user_message:
        return StreamingResponse(iter([]), media_type="text/event-stream")

    return StreamingResponse(
        stream_agent_response(last_user_message, request.session_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",       # disables Nginx buffering
            "Connection": "keep-alive",
            "x-vercel-ai-data-stream": "v1", # ← tells useChat() to parse Data Stream Protocol v1
        },
    )


@app.delete("/api/chat/{session_id}")
async def clear_session(session_id: str):
    """Clear a session's conversation memory."""
    if session_id in _session_memories:
        del _session_memories[session_id]
    return {"cleared": True}


@app.get("/health")
async def health():
    return {"status": "ok", "model": os.getenv("ANTHROPIC_MODEL", "claude-haiku-4-5-20251001")}
