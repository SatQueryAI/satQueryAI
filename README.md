# SatQuery AI 🛰️🤖

SatQuery AI is an intelligent Earth Observation and Satellite Imagery analysis platform powered by Visual Question Answering (VQA), Change Detection, and Multi-modal AI models.

---

## 📁 Repository Structure

```text
satquery-ai/
│
├── frontend/              # React + Vite frontend application
│
├── backend/               # FastAPI backend API services
│
├── ml/                    # Machine Learning pipelines & model architectures
│   ├── models/            # Model definitions (VQA, Change Detection, Encoders)
│   ├── datasets/          # Dataset loaders, processors & pipelines
│   ├── training/          # Training loops, loss functions & fine-tuning scripts
│   └── inference/         # Model serving, evaluation & batch inference pipelines
│
├── shared/                # Shared schemas, data models & types
│
├── scripts/               # Setup, preprocessing, evaluation & migration scripts
│
├── docs/                  # Architecture diagrams, experiment logs & API specifications
│
├── .github/
│   └── workflows/         # CI/CD pipelines & automation workflows
│
├── README.md              # Project overview & documentation
├── .gitignore             # Git ignored files & directories
└── docker-compose.yml     # Multi-container orchestration (FastAPI + React + ML workers)
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm / pnpm / yarn
- Docker & Docker Compose (optional for containerized deployment)
- CUDA-enabled GPU (optional for accelerated ML inference/training)

---

## 🛠️ Components Overview

- **`frontend/`**: Modern web UI built with React + Vite for interactive map visualization, query input, and change inspection.
- **`backend/`**: High-performance REST & WebSocket API powered by FastAPI.
- **`ml/`**: Core satellite intelligence engine handling Visual Question Answering (VQA) and bi-temporal / multi-temporal change detection.
- **`shared/`**: Common data structures, Pydantic schemas, and API contracts.
- **`scripts/`**: Automation tools for data ingestion, downloading satellite tiles, and benchmark runs.
- **`docs/`**: Detailed project documentation and research notes.
