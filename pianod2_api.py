#!/usr/bin/env python3

import asyncio
import websockets
import json
import argparse


async def rpc(websocket, name, args):
    await websocket.send(json.dumps({name: args}))

    async def receive_response():
        while True:
            message = json.loads(await websocket.recv())
            if "code" not in message:
                continue
            code = message["code"]
            if code == 203:
                return message["data"]
            if code >= 200 and code <= 299:
                return None
            if code >= 400 and code <= 499:
                raise RuntimeError(message["status"])

    return await asyncio.wait_for(receive_response(), timeout=1.0)


async def getSchema(websocket, request):
    response = await rpc(websocket, "getSchema", {"request": request})
    lines = [line["information"] for line in response]
    return lines


async def getAllCommands(websocket):
    lines = await getSchema(websocket, [])
    if len(lines) > 2 and lines[0].startswith("All requests take the form:"):
        lines = lines[2:]
    return lines


async def main():
    parser = argparse.ArgumentParser(description='Query pianod2 API documents.')
    parser.add_argument('method', type=str, nargs="?", help='The requested API method')
    args = parser.parse_args()

    async with websockets.connect("ws://localhost:4446/pianod?protocol=json") as websocket:
        welcome_message = json.loads(await websocket.recv())
        assert welcome_message["code"] == 200
        method = args.method

        available_methods = await getAllCommands(websocket)
        if method is None:
            for available_method in available_methods:
                print(available_method)
            return

        if method not in available_methods:
            print(f"Method '{method}' does not exist.")
            return

        try:
            response = await getSchema(websocket, [method])

            for line in response:
                print(line)
        except Exception as e:
            print(f"Error: {e}")


if __name__ == "__main__":
    asyncio.run(main())
