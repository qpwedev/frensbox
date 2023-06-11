import { useState, useEffect } from "react";
import { utils } from "ethers";

export default function useGnoBalance(address: string) {
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://rpc.ap-southeast-1.gateway.fm/v4/gnosis/non-archival/mainnet`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
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
  }, [address]);

  return { balance, loading, error };
}
