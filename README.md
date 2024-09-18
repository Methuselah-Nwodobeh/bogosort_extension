
# BogoSort AI

## Description

A tool that allows developers to search through codebases using natural language queries. The AI would understand queries like "Find all functions that deal with authentication" and return their metadata.

### Natural Language Querying

The system should interpret user queries such as "Find all functions related to authentication" and return relevant locations in the code.

### Codebase Analysis

The AI should be capable of parsing code repositories and understanding the structure (functions, classes, etc.) to provide better search results.

### Language Support

Determine which programming languages to support (e.g., Java, Python, JavaScript).

## Key Features

### Search by Functionality

Users can search for code based on functionality (e.g., "list all authentication methods").

### Search by Code Structure

Queries like "find all classes that extend from X" or "get all public methods in class Y".

### Query Execution

The AI will map natural language queries to code searches and return the most relevant results.

## Architecture

### Frontend

- VS Code Extension (BogoSort)

### Backend

- Python (Flask/FastAPI) or Node.js for handling API requests. This is run locally

### Code Understanding

The AI will need to understand the code metadata provided to it.
