# NafaSchool Model Selection Policy

## 1. Overview
This policy defines the governance rules for selecting AI models, handling sensitive data, managing rate limits, and enforcing human oversight during the development of NafaSchool. As the sole developer and accountable human, I ensure that all AI-generated code is thoroughly inspected and tested before merging into the `main` branch.

## 2. Routine-Task Model
* **Model Selection:** A fast, cost-effective, and capable free-tier model accessed via OpenRouter (e.g., Llama 3 or Gemini Flash variants).
* **Usage:** Used for boilerplate code generation, updating documentation, drafting unit test skeletons, and organizing Markdown records.

## 3. High-Stakes-Task Model
* **Model Selection:** A highly capable reasoning model (e.g., advanced free models available via OpenRouter or local execution).
* **Usage:** Reserved for core business logic implementation (such as fee calculations and payment balances), complex debugging, security rule implementation, and architectural decision-making.

## 4. Data Privacy Boundary (Never Sent to Hosted Models)
To maintain data privacy and comply with security standards, the following data **never** leaves the local environment or goes to a hosted external AI model API:
* Real pupil or guardian names
* Telephone numbers
* Actual payment references or transaction IDs
* Production database credentials or API secrets

## 5. Rate-Limit Fallback Strategy
* **Primary Gateway:** OpenRouter API free tier.
* **Fallback Mechanism:** If OpenRouter experiences rate-limiting or service outages, development pivots to a local coding model hosted via **Ollama** running locally on the machine, ensuring zero disruption to the development pipeline.

## 6. Generator-Reviewer Pattern
* **Generator:** The AI coding agent generates code increments, functions, and test files based on precise functional prompts.
* **Reviewer:** The human developer acts as the final quality gate. Every line of generated code is read, verified against requirements, tested locally via Vitest (`npm test`), and critically evaluated through GitHub Pull Request review comments before being approved and merged.