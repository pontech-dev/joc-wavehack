"use client";
import { getContract, prepareContractCall } from "thirdweb";
import { mintTo } from "thirdweb/extensions/erc20";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
  useReadContract,
  useSendTransaction,
  useWalletBalance,
} from "thirdweb/react";
import { client } from "../client";
import { abi } from "../abi";

export default function JPYFaucet() {
  const chain = {
    id: 10081,
    rpc: "https://rpc-1.testnet.japanopenchain.org:8545",
  };
  const tokenAddress = "0x9f5bFA5D2C903a59fAd17b71D346484f992caa21";
  const contract = getContract({
    client,
    chain,
    address: tokenAddress,
    //@ts-ignore
    abi: abi!,
  });

  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const account = useActiveAccount();
  const wallet = useActiveWallet();

  const {
    data: balance,
    isLoading,
    isError,
  } = useWalletBalance({
    chain,
    address: account?.address,
    client,
    tokenAddress,
  });

  const mintJPY = async () => {
    console.log("minting JPY");
    const amount = 1000;
    console.log(contract);

    const tx = await mintTo({
      contract,
      to: "0xB6Ac3Fe610d1A4af359FE8078d4c350AB95E812b",
      amount: amount,
    });
    console.log(tx, "tx");
    sendTransaction(tx);
  };

  return (
    <>
      <div className="mx-auto w-64 text-center">
        <div className="mt-20 mb-12">
          <h1 className="text-3xl font-bold text-black">JPY Faucet</h1>
          <p className="text-lg text-gray-800">Mint JPY tokens</p>
        </div>
        {account ? (
          <div className="flex flex-col gap-8">
            <p className="text-gray-800">balance: ¥{balance?.displayValue}</p>
            <button
              onClick={() => mintJPY()}
              className="flex mx-auto w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
            >
              Mint ¥1,000
            </button>
            <ConnectButton client={client} />
          </div>
        ) : (
          <ConnectButton client={client} />
        )}
      </div>
    </>
  );
}
