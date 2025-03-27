from typing import List, Dict, Any
from flask import json
from pydantic import BaseModel, Field
from openai import OpenAI
from google import genai
from google.genai import types
import pathlib
import os
from dotenv import load_dotenv, dotenv_values 

class InvoiceModel(BaseModel):
    """Model representing structured data extracted from an invoice."""
    
    company_name: str = Field(
        description="The official name of the company or organization responsible for payment as listed on the invoice."
    )
    licenses: int = Field(
        description="Number of software licenses purchased"
    )
    sku: List[str] = Field(
        description="List of Name of the Stock Keeping Units for the products"
    )
    billing_start_date: str = Field(
        description="Start date of the billing period (format: DD-MM-YYYY)"
    )
    billing_end_date: str = Field(
        description="End date of the billing period (format: DD-MM-YYYY)"
    )
    pricing_per_license: float = Field(
        description="Cost per individual license in the invoice currency"
    )
    total_amount: float = Field(
        description="Total amount billed in the invoice currency"
    )

def json_to_rich_text(data: Dict[str, Any]) -> str:
    """Convert invoice JSON data to rich text format for display"""
    try:
        if isinstance(data, str):
            try:
                data = json.loads(data)
            except:
                return f"<div class='error'>Invalid JSON: {data}</div>"
        
        # Format SKUs as a bulleted list
        sku_list = ""
        if "sku" in data and isinstance(data["sku"], list):
            sku_items = "".join([f"<li>{sku}</li>" for sku in data["sku"]])
            sku_list = f"<ul>{sku_items}</ul>"
        
        # Create HTML table with invoice data
        rich_text = f"""
        <div class="invoice-result">
            <h3>Invoice Details</h3>
            <table class="invoice-table">
                <tr>
                    <th>Company Name</th>
                    <td>{data.get('company_name', 'N/A')}</td>
                </tr>
                <tr>
                    <th>Licenses</th>
                    <td>{data.get('licenses', 'N/A')}</td>
                </tr>
                <tr>
                    <th>SKU</th>
                    <td>{sku_list if sku_list else data.get('sku', 'N/A')}</td>
                </tr>
                <tr>
                    <th>Billing Period</th>
                    <td>{data.get('billing_start_date', 'N/A')} to {data.get('billing_end_date', 'N/A')}</td>
                </tr>
                <tr>
                    <th>Price per License</th>
                    <td>₹{data.get('pricing_per_license', 'N/A')}</td>
                </tr>
                <tr>
                    <th>Total Amount</th>
                    <td>₹{data.get('total_amount', 'N/A')}</td>
                </tr>
            </table>
        </div>
        """
        return rich_text
    except Exception as e:
        return f"<div class='error'>Error formatting invoice data: {str(e)}</div>"

def process_invoice_openai(invoice_text: str):
    # Ensure API key is available
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return "Error: OpenAI API key not configured"
        
    client = OpenAI(api_key=api_key)
    with client.beta.chat.completions.stream(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": """You are an assistant that extracts structured invoice data. 
Extract InvoiceModel from the input text with the following fields:
- company_name: The official name of the company or organization responsible for payment as listed on the invoice.
- licenses: Number of software licenses purchased
- sku: List of Name of the Stock Keeping Units for the products
- billing_start_date: Start date of the billing period (format: DD-MM-YYYY)
- billing_end_date: End date of the billing period (format: DD-MM-YYYY)
- pricing_per_license: Cost per individual license in the invoice currency
- total_amount: Total amount billed in the invoice currency"""},
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
    # Ensure API key is available
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "Error: Gemini API key not configured"
        
    client = genai.Client(api_key=api_key)
    prompt = """Extract the following information from this invoice:
- company_name: The official name of the company or organization responsible for payment as listed on the invoice.
- licenses: Number of software licenses purchased
- sku: List of Name of the Stock Keeping Units for the products
- billing_start_date: Start date of the billing period (format: DD-MM-YYYY)
- billing_end_date: End date of the billing period (format: DD-MM-YYYY)
- pricing_per_license: Cost per individual license in the invoice currency
- total_amount: Total amount billed in the invoice currency"""
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

