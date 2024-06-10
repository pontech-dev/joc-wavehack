"use client";
import { getContract, prepareContractCall } from "thirdweb";
import { lazyMint, setClaimConditions } from "thirdweb/extensions/erc1155";
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
  useReadContract,
  useSendTransaction,
  useWalletBalance,
} from "thirdweb/react";
import { client } from "../client";
import { nftAbi } from "../abi";
import { nftAddress, tokenAddress } from "../data";

export default function Register() {
  const chain = {
    id: 10081,
    rpc: "https://rpc-1.testnet.japanopenchain.org:8545",
  };
  const contract = getContract({
    client,
    chain,
    address: nftAddress,
  });

  const account = useActiveAccount();
  const wallet = useActiveWallet();
  const { mutate: sendTransaction, isPending } = useSendTransaction();

  const mintNFT = async () => {
    console.log("minting NFT");
    const amount = 1000;
    console.log(contract);

    const tx = await lazyMint({
      contract,
      nfts: [
        {
          name: "My NFT",
          description: "This is my NFT",
          image: "https://example.com/image.png",
        },
      ],
    });

    console.log(tx, "tx");
    sendTransaction(tx);
    console.log("sent transaction");
  };

  const setCondition = async () => {
    const tx = await setClaimConditions({
      contract,
      tokenId: 0n,
      phases: [
        {
          maxClaimableSupply: 100n,
          maxClaimablePerWallet: 1n,
          currencyAddress: tokenAddress,
          price: 100,
          startTime: new Date(),
        },
      ],
    });
    sendTransaction(tx);
  };

  return (
    <>
      <div className="mx-auto w-64 text-center">
        <div className="mt-20 mb-12">
          <h1 className="text-3xl font-bold text-black">NFT Mint</h1>
          <p className="text-lg text-gray-800">商品となるNFTをLazymintする</p>
        </div>
        {account ? (
          <div className="flex flex-col gap-8">
            <button
              onClick={() => mintNFT()}
              className="flex mx-auto w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
            >
              Mint NFT
            </button>
            <button
              onClick={() => setCondition()}
              className="flex mx-auto w-full items-center justify-center rounded-md border border-transparent bg-indigo-400 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
            >
              Set Condition
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
