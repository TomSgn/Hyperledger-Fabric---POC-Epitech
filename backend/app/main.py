from fastapi import FastAPI, HTTPException
from xrpl.asyncio.clients import AsyncJsonRpcClient  # If there's an async version
from xrpl.asyncio.wallet import generate_faucet_wallet
from xrpl.models.transactions import Payment
from xrpl.asyncio.transaction import sign_and_submit, submit_and_wait, autofill  # Use async versions if available
from xrpl.asyncio.account import get_balance  # Use async versions if available
from typing import Optional
import asyncio
from concurrent.futures import ThreadPoolExecutor

app = FastAPI()
executor = ThreadPoolExecutor()

client = AsyncJsonRpcClient("https://s.altnet.rippletest.net:51234")

@app.get("/get_balance/{address}")
async def get_wallet_balance(address: str):
    try:
        balance = await get_balance(address, client)
        return {"address": address, "balance": balance}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/create_wallet")
async def create_wallet_endpoint():
    try:
        # Run the synchronous function in a separate thread
        wallet = await generate_faucet_wallet(client, debug=True)
        return {
            "address": wallet.classic_address,
            "seed": wallet.seed,
            "public_key": wallet.public_key,
            "private_key": wallet.private_key
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create wallet: {str(e)}")

@app.post("/issue_currency")
async def issue_currency():
    try:
        wallet = await generate_faucet_wallet(client, debug=True)  # await if this is async
        payment = Payment(
            account=wallet.classic_address,
            destination=wallet.classic_address,
            amount={"currency": "USD", "value": "1000", "issuer": wallet.classic_address}
        )
        autofilled_payment = await autofill(payment, client)  # await if autofill is async
        signed_tx = await sign_and_submit(autofilled_payment, client, wallet)  # await for async operation
        return {"status": signed_tx.result["engine_result"], "tx_blob": signed_tx.result["tx_blob"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to issue currency: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Hello XRPL"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}
