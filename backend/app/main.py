from fastapi import FastAPI
from pydantic import BaseModel
from xrpl.account import get_balance
from xrpl.clients import JsonRpcClient
from xrpl.models import Payment, Tx
from xrpl.transaction import submit_and_wait
from xrpl.wallet import generate_faucet_wallet

app = FastAPI()

client = JsonRpcClient("https://s.altnet.rippletest.net:51234")

# Create two wallets to send money between on the test network
wallet1 = generate_faucet_wallet(client, debug=True)
wallet2 = generate_faucet_wallet(client, debug=True)


class Wallet(BaseModel):
    adress: str
    price: float


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/wallet")
async def wallet():
    return {"message": "Walletttt"}
