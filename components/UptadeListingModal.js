import { Modal, Input, useNotification } from "@web3uikit/core"
import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import { ethers } from "ethers"

export default function UpdateListingModal({
    isVisible,
    nftAddress,
    tokenId,
    marketplaceAddress,
    onClose,
}) {
    const dispatch = useNotification()

    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0)

    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
        },
    })

    const handleUpdateListingSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Listing updated!",
            title: "Listing Updated - Please refresh (and move blocks)",
            position: "topR",
        })
        onClose && onClose()
        setPriceToUpdateListingWith(0)
    }

    return (
        <Modal
            isVisible={isVisible}
            onOk={() => {
                updateListing({
                    onError: (error) => console.log(error),
                    onSuccess: handleUpdateListingSuccess,
                })
            }}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
        >
            <Input
                label="Update listing price in L1 Currency (ETH)"
                name="New listing price"
                type="number"
                onChange={(event) => {
                    setPriceToUpdateListingWith(event.target.value)
                }}
            ></Input>
        </Modal>
    )
}
