"""
QA Agent — a conversational agent with memory that engages users
until their question is fully resolved.
"""
import os
from langchain_anthropic import ChatAnthropic
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain.memory import ConversationBufferWindowMemory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.tools import tool


# ── Optional tools the agent can use ────────────────────────────────────────
# Add or swap real tools here (web search, database lookup, etc.)

@tool
def get_current_date(_: str = "") -> str:
    """Returns today's date. Useful when the user asks about time-sensitive info."""
    from datetime import date
    return str(date.today())


TOOLS = [get_current_date]
# To add more tools:
#   from langchain_community.tools import DuckDuckGoSearchRun
#   TOOLS.append(DuckDuckGoSearchRun())


# ── Prompt ───────────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are a knowledgeable, thoughtful AI assistant. Your goal is to fully \
resolve the user's question or curiosity through clear, precise, and engaging conversation.

Guidelines:
- Give complete, accurate answers. Never truncate if the topic requires depth.
- Ask a clarifying follow-up question when the user's intent is ambiguous.
- Use markdown formatting: **bold** for key terms, `code` for technical terms, 
  bullet lists for enumerable items, and code blocks for any code samples.
- Keep a conversational tone — helpful and warm, not robotic.
- When you believe the user's question is fully addressed, briefly confirm and \
  invite further questions.

You have access to tools when you need real-time or computed information."""


def create_agent(session_memory: ConversationBufferWindowMemory) -> AgentExecutor:
    """
    Factory that creates a new AgentExecutor with the given memory object.
    Call once per user session.
    """
    #model = os.getenv("ANTHROPIC_MODEL","claude-haiku-4-5")
    model = "claude-haiku-4-5-20251001"
    temperature = float("0.7")

    llm = ChatAnthropic(
        model=model,
        temperature=temperature,
        streaming=True,           # ← enables token-by-token SSE streaming
	    anthropic_api_key=os.getenv("ANTHROPIC_API_KEY")
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])

    agent = create_tool_calling_agent(llm, TOOLS, prompt)

    return AgentExecutor(
        agent=agent,
        tools=TOOLS,
        memory=session_memory,
        return_intermediate_steps=True,
        handle_parsing_errors=True,
		verbose=True
    )
