const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();
async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_Url);
  const wallet = new ethers.Wallet(process.env.Private_key, provider);
  // const encryptedJson = fs.readFileSync("./.encryptedKey.json", "utf8");
  // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
  //   encryptedJson,
  //   process.env.PRIVATE_KEY_PASSWORD
  // );
  // wallet = wallet.connect(provider);
  const abi = fs.readFileSync("./Simplestorage_sol_SimpleStorage.abi", "utf-8");
  const binary = fs.readFileSync(
    "./Simplestorage_sol_SimpleStorage.bin",
    "utf-8"
  );
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
  console.log("Deploying......");
  const contract = await contractFactory.deploy();

  const favoriteNumber = await contract.retrieve();
  const transactionresponse = await contract.store("6");
  console.log(transactionresponse);
  const transactionreceipt = await transactionresponse.wait(1);
  console.log("trans receipt");
  console.log(transactionreceipt);
  console.log("look here");
  console.log(`Favourite number: ${favoriteNumber.toString()}`);
  const updatedfavnum = await contract.retrieve();
  console.log("updated fav num below......");
  console.log(`Updated favnum is: ${updatedfavnum.toString()}`);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
