import { useState, useEffect } from "react";
import { utils } from "ethers";
import { env } from "../config";

export type AvailableChains = "ethereum" | "near" | "optimism" | "polygon";

export default function useEVMBalance(address: string, chain: AvailableChains) {
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://rpc.eu-north-1.gateway.fm/v4/${chain}/non-archival/mainnet`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${env.GATEWAY_BEARER_TOKEN}`,
            },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: 1,
              method: "eth_getBalance",
              params: [address, "latest"],
            }),
          }
        );

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error.message);
        }

        const decimalWeiBalance = parseInt(data.result, 16);

        const decimalBalance = utils.formatEther(
          utils.parseUnits(decimalWeiBalance.toString(), "wei")
        );

        setBalance(decimalBalance);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [address, chain]);

  return { balance, loading, error };
}
