from typing import Optional
from fastapi import FastAPI
from xrpl.wallet import generate_faucet_wallet
from xrpl.clients import WebsocketClient
from xrpl.models.transactions import Payment

app = FastAPI()

@app.get("/get_balance/{address}")
async def get_wallet_balance(address: str):
    try:
        # Fetches the XRP balance of the account
        balance = get_balance(address, client)
        return {"address": address, "balance": balance}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/create_wallet")
async def create_wallet():
    testnet_url = "wss://s.altnet.rippletest.net:51233"
    with WebsocketClient(testnet_url) as client:
        wallet = generate_faucet_wallet(client, debug=True)
        return {"address": wallet.classic_address, "seed": wallet.seed}

@app.post("/issue_currency")
async def issue_currency():
    testnet_url = "wss://s.altnet.rippletest.net:51233"
    with WebsocketClient(testnet_url) as client:
        wallet = generate_faucet_wallet(client, debug=True)
        issuer = wallet
        amount = "1000000000"
        currency_code = "WYNIT"
        payment = Payment(
            account=issuer.classic_address,
            destination=issuer.classic_address,
            amount={
                "currency": currency_code,
                "value": amount,
                "issuer": issuer.classic_address
            }
        )
        prepared = safe_sign_and_autofill_transaction(payment, issuer, client)
        response = send_reliable_submission(prepared, client)
        return {"status": response.result["engine_result"], "issued_currency": f"{amount} {currency_code}"}

@app.get("/")
async def root():
    return {"message": "Hello XRPL"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}
