import { useMoralis, useMoralisQuery } from "react-moralis"
import NFTBox from "../components/NFTBox"
import networkMapping from "../constants/networkMapping.json"
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries"
import { useQuery } from "@apollo/client"

export default function Home() {
    const { isWeb3Enabled } = useMoralis()

    const { chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const contractAddressesArray = networkMapping[chainString].NftMarketplace
    const marketplaceAddress =
        networkMapping[chainString].NftMarketplace[contractAddressesArray.length - 1]

    const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    loading || !listedNfts ? (
                        <div>Loading...</div>
                    ) : (
                        listedNfts.activeItems.map((nft) => {
                            const { price, nftAddress, tokenId, seller } = nft
                            return (
                                <div>
                                    <NFTBox
                                        price={price}
                                        nftAddress={nftAddress}
                                        tokenId={tokenId}
                                        marketplaceAddress={marketplaceAddress}
                                        seller={seller}
                                        key={`${nftAddress}${tokenId}`}
                                    />
                                </div>
                            )
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    )
}
