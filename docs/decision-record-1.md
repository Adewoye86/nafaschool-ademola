# Decision Record #1: AI Model Selection and Trust Rules

## 1. Model and Gateway Choice
* *Context:* Choosing the AI model and gateway for building NafaSchool while staying within free/open tooling constraints as specified in the reference stack.
* *Decision:* Selected OpenRouter as the gateway, utilizing the free tier model [Insert Model Name, e.g., Meta Llama 3 or Gemini Flash] for routine development tasks, and a local Ollama fallback model for rate-limit protection.
* *Alternatives Rejected:* 
  * Local Ollama model as primary — Rejected because of hardware resource constraints and slower iteration speed on standard laptop hardware.
  * Paid commercial models — Rejected due to the course constraint requiring zero-cost free tooling.
* *Consequences:* Dependency on internet connectivity for OpenRouter, with a local Ollama fallback available if rate limits or network drops occur.

---

## 2. Trust Rule for Agent-Generated Changes
* *Context:* Establishing safety and correctness boundaries when using an AI coding agent for NafaSchool, a financial application handling school fee records and balances where accuracy is critical.
* *Decision:* Establishing a strict two-tier trust rule for agent-generated code:
  * *Line-by-Line Read & Test Required:* 
    * Fee logic and termly balance calculations ($45,000 + (D \times 5,000)$ XOF).
    * Payment recording, database schema models, and transaction handling.
    * Any code involving data deletion, migrations, or security boundaries.
  * *Lighter Check Accepted:*
    * Standard boilerplate scaffolding, basic UI styling layouts, or routine test structure generation (provided they are fully verified by running automated test suites).
* *Consequences:* Slower initial development velocity traded for high correctness, auditability, and zero risk of corrupted or lost financial ledger data.