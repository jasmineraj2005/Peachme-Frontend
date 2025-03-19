# PeachMe 

A Next.js frontend application for the PeachMe platform, providing video upload and transcription capabilities.

## Prerequisites

- Node.js 18 or higher
- Python 3.11 or higher (for backend)
- FFmpeg (for video processing)
- Docker and Docker Compose (optional)

## Environment Setup

1. Create a `.env` file in the root directory:
```env
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:8001

# Backend Environment Variables
OPENAI_API_KEY=your_openai_api_key_here
LANGCHAIN_API_KEY=your_langchain_api_key_here
LANGCHAIN_PROJECT=peachme-chat
LANGCHAIN_TRACING_V2=true
DATABASE_URL=sqlite:///./peachme_fastapi/peachme.db
CORS_ORIGINS=["http://localhost:3000"]
```

## Running with Docker (Recommended)

This method runs both frontend and backend services in containers:

```bash
# Build and start all services
docker-compose up --build

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

The services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8001

## Running Without Docker

### Backend Setup

1. Navigate to the backend directory:
```bash
cd peachme_fastapi
```

2. Create and activate a Python virtual environment:
```bash
# On macOS/Linux
python -m venv venv
source venv/bin/activate

# On Windows
python -m venv venv
.\venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the FastAPI server:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The services will be available at the same ports as with Docker.

## Development

### Directory Structure
```
.
├── app/                  # Next.js frontend application
├── peachme_fastapi/      # FastAPI backend (submodule)
├── docker-compose.yml    # Docker services configuration
├── Dockerfile.frontend   # Frontend container configuration
└── .env                 # Environment variables
```

### Making Changes

- Frontend code changes will automatically trigger hot reload
- Backend code changes will automatically trigger reload in development mode
- Environment variables changes require service restart

## API Documentation

When the backend is running, API documentation is available at:
- Swagger UI: http://localhost:8001/docs
- ReDoc: http://localhost:8001/redoc

## Common Issues

1. **Port Conflicts**: If ports 3000 or 8001 are in use, modify the port mappings in `docker-compose.yml` or use different ports when running services directly.

2. **Environment Variables**: Make sure all required environment variables are set in `.env` file.

3. **FFmpeg Missing**: Install FFmpeg if running without Docker:
```bash
# On macOS
brew install ffmpeg

# On Ubuntu/Debian
sudo apt-get install ffmpeg

# On Windows (using Chocolatey)
choco install ffmpeg
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.