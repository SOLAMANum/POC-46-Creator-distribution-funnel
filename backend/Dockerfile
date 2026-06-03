# ============================================================
# Backend — FastAPI via Uvicorn
# Build context: ./backend directory
# ============================================================
FROM python:3.12-slim

WORKDIR /app

# Suppress .pyc files and force unbuffered stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Least-privilege system account
RUN addgroup --system --gid 1001 appgroup \
 && adduser  --system --uid 1001 --ingroup appgroup appuser

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt

# Copy application source (main.py + CSV data file)
COPY . .

# Fix ownership before dropping privileges
RUN chown -R appuser:appgroup /app

USER appuser

EXPOSE 5000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000", "--workers", "1"]
