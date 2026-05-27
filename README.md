# basic-agentic-app
Previously, I built a CLI chatbot using LangChain and Ollama: https://github.com/jasalazar/basic-cli-chatbot  
  
Now, I built a basic single-agent chatbot app over a single page UI, also with LangChain but powered by Anthropic LLMs.
## Assumptions
-You already have Python, Node.js and npm installed  
-You have an Anthropic API key with credits loaded
## First step
Install libraries and dependencies `pip install -r requirements.txt`
## Second step
Install all node packages `npm install`
## Run the chatbot
-Open 2 cli tabs, 1 for the **frontend** folder and the other one for the **backend** folder  
-On the backend cli start the server by running `uvicorn main:app --reload --port 8000`  
-On the frontend tab, start the app by running `npm run dev`  
-Open the following address on a browser `http://localhost:5173/`
## Tech stack
### Frontend
React + Vite
### Backend
FastAPI + LangChain for agent orchestration.
