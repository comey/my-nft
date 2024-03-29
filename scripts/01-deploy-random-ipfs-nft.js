const hre = require("hardhat");
async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const chainId = network.config.chainId
    console.log("Deploying contracts to chainid:", chainId);
    let vrfCoordinatorV2Address, subscriptionId
    const FUND_AMOUNT = "10000000000000000000"
    const callBackGasLimit = "500000"
    const gasLane = "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c"
    const tokenUris = [
        "ipfs://bafybeig47wi6sf6etamzjwdjzs5t2obsvc4w3bvrmwvyqtcikzhrcgtwre/0.json",
        "ipfs://bafybeig47wi6sf6etamzjwdjzs5t2obsvc4w3bvrmwvyqtcikzhrcgtwre/1.json",
        "ipfs://bafybeig47wi6sf6etamzjwdjzs5t2obsvc4w3bvrmwvyqtcikzhrcgtwre/2.json"
    ]
    // if we are working with a testnet or a mainnet
    // those addresses will exist
    // otherwise ... they don't

    if(chainId == 31337) {
        const BASE_FEE = "250000000000000000"
        const GAS_PRICE_LINK = 1e9;     
        //const meta_0 = await hre.network.provider.send("hardhat_metadata");
        //console.log(meta_0);
        const vrfCoordinatorV2Mock = await ethers.deployContract("VRFCoordinatorV2Mock", [BASE_FEE, GAS_PRICE_LINK])
        console.log("VRFCoordinatorMock is Deployed at: ", vrfCoordinatorV2Mock.target)
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
        const transactionReceipt = await transactionResponse.wait(1);
        //console.log(transactionReceipt);
        subscriptionId = transactionReceipt.logs[0].topics[1];
        //console.log(subscriptionId)
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT) 
        const result = await vrfCoordinatorV2Mock.getSubscription(subscriptionId)
        //console.log(result)
        vrfCoordinatorV2Address=vrfCoordinatorV2Mock.target
    } else {
        // use the real ones 
        vrfCoordinatorV2Address = "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625"
        subscriptionId = "9328"
    }

    args = [
        vrfCoordinatorV2Address,
        gasLane,
        subscriptionId,
        callBackGasLimit,
        tokenUris
    ]

    const randomIpfsNft = await ethers.deployContract("RandomIpfsNft", args)
    console.log("NFT Contract is Deployed at: ", randomIpfsNft.target)

}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });