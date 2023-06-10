"use client";
import { useExploreProfiles } from "@lens-protocol/react-web";
import Link from "next/link";
import { formatPicture } from "../utils";
import {
  useWalletLogin,
  useWalletLogout,
  useActiveProfile,
} from "@lens-protocol/react-web";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { useState } from "react";

export default function Home() {
  const { data: profiles } = useExploreProfiles({
    limit: 25,
  });

  const [searchInput, setSearchInput] = useState("");

  const handleSearchChange = (event: any) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = (event: any) => {
    event.preventDefault(); // this prevents the page from reloading
    // the navigation will be handled by the Link component
  };

  const { execute: login, isPending: isLoginPending } = useWalletLogin();
  const { execute: logout } = useWalletLogout();
  const { data: wallet, loading } = useActiveProfile();
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  const onLoginClick = async () => {
    if (isConnected) {
      await disconnectAsync();
    }
    const { connector } = await connectAsync();
    if (connector instanceof InjectedConnector) {
      const signer = await connector.getSigner();
      await login(signer);
    }
  };

  return (
    <div className="p-20">
      {loading && <p>Loading...</p>}
      {!wallet && !loading && (
        <button
          className="mt-2 px-6 py-1 bg-white text-black rounded"
          disabled={isLoginPending}
          onClick={onLoginClick}
        >
          Sign in
        </button>
      )}
      {wallet && !loading && (
        <div>
          <h3 className="text-3xl">{wallet.handle}</h3>
          <p>{wallet.bio}</p>
          <button
            onClick={logout}
            className="mt-2 px-6 py-1 bg-white text-black rounded"
          >
            Sign out
          </button>
        </div>
      )}

      <form onSubmit={handleSearchSubmit}>
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search profiles"
          className="mt-2 px-4 py-2 bg-white text-black rounded"
        />
        {searchInput && (
          <Link href={`/profile/${searchInput}.lens`}>
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-white text-black rounded"
            >
              Go
            </button>
          </Link>
        )}
      </form>

      <h1 className="text-5xl">My Lens App</h1>
      {profiles?.map((profile, index) => (
        <Link href={`/profile/${profile.handle}`} key={index}>
          <div className="my-14">
            {profile.picture && profile.picture.__typename === "MediaSet" ? (
              <img
                src={formatPicture(profile.picture)}
                width="120"
                height="120"
                alt={profile.handle}
              />
            ) : (
              <div className="w-14 h-14 bg-slate-500  " />
            )}
            <h3 className="text-3xl my-4">{profile.handle}</h3>
            <p className="text-xl">{profile.bio}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
