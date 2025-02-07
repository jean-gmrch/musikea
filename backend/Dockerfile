FROM python:3.12.0-slim-bookworm

WORKDIR /usr/src/app

ENV PIP_DISABLE_PIP_VERSION_CHECK=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY . .

RUN pip3 install poetry
RUN poetry config virtualenvs.create false
RUN poetry install --only main --no-root --no-cache

CMD ["fastapi", "run", "main.py"]
