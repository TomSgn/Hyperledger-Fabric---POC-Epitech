# Use an official Python runtime as a parent image
FROM python:latest

# Set the working directory in the container
WORKDIR /code

# Copy the current directory contents into the container at /code
COPY ./app /code/app

RUN pip install fastapi uvicorn xrpl-py

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
