"use client"
import { ConnectWallet } from "@thirdweb-dev/react";
export default function Web3Button() {
    return (
        <div>
            <ConnectWallet theme="dark" />
        </div>

    )
}
