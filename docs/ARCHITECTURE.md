# Shiproof — Technical Architecture

## System Architecture

```mermaid
graph TB
    subgraph GitHub["GitHub Webhook"]
        A[Push Event] --> B[Webhook Endpoint]
    end

    subgraph Backend["API Route"]
        B --> C[Extract Diff]
        C --> D[OpenAI Summarize]
        D --> E[Draft Tweet]
    end

    subgraph SagaPad["SagaPad Skill"]
        E --> F[Skill Manifest]
        F --> G[X API Post]
    end
```

## Integration Map

| Feature | Use Case | Depth |
|---|---|---|
| **GitHub Webhook** | Listen for push events | 🟢 Core |
| **OpenAI Summarize** | Generate tweet from diff | 🟢 Core |
| **SagaPad Skill** | Register as installable skill | 🟢 Core |

## API Routes

| Method | Path | Description |
|---|---|---|
| POST | `/api/webhook/github` | Receive push event → draft tweet |
| GET | `/api/ships` | Recent "Proof of Ship" posts |
