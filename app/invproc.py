from typing import List
from pydantic import BaseModel
from openai import OpenAI
from google import genai
from google.genai import types
import pathlib
import pymupdf
import os
from dotenv import load_dotenv, dotenv_values 
import sys

class InvoiceModel(BaseModel):
    company_name: str
    licenses: int
    sku: List[str]
    billing_start_date: str
    billing_end_date: str
    pricing_per_license: float
    total_amount: float

def process_invoice_openai(invoice_text: str):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    with client.beta.chat.completions.stream(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are an assistant that extracts structured invoice data. Extract InvoiceModel from the input text"},
        {"role": "user", "content": invoice_text},
    ],
    response_format=InvoiceModel,
    ) as stream:
        for event in stream:
            if event.type == "content.delta":
                if event.parsed is not None:
                    print("content.delta parsed:", event.parsed)
            elif event.type == "content.done":
                print("content.done")
            elif event.type == "error":
                print("Error in stream:", event.error)

    final_completion = stream.get_final_completion()
    
    # Convert the ParsedChatCompletion object to a JSON-serializable format
    if hasattr(final_completion, 'choices') and final_completion.choices:
        message = final_completion.choices[0].message
        if hasattr(message, 'content') and message.content:
            return message.content
        elif hasattr(message, 'parsed'):
            # Convert Pydantic model to dictionary
            return message.parsed.model_dump()
    
    # Fallback to string representation
    return str(final_completion)

def process_invoice_gemini(filepath: pathlib.Path):
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    prompt = "Summarize this document"
    response = client.models.generate_content_stream(
        model="gemini-2.0-flash",
        contents=[
            types.Part.from_bytes(
                data=filepath.read_bytes(),
                mime_type='application/pdf',
            ),
            prompt],
        config= {
            'response_mime_type': 'application/json',
            'response_schema': InvoiceModel,
        }
    )
    
    final_completion = ""

    for chunk in response:
        print(chunk.text, end="")
        final_completion += chunk.text

    return final_completion