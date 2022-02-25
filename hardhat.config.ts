import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

task("transferFrom", "Transfer from one to another")
  .addParam("sender", "sender")
  .addParam("recipient", "recipient")
  .addParam("amount", "amount")
  .setAction(async (args, hre) => {
    const ERC20 = await hre.ethers.getContractFactory("ERC20");
    const erc20 = await ERC20.deploy("MyToken", "MTKN", 18);

    await erc20.deployed();

    const transferFrom = await erc20.transferFrom(
      args.sender,
      args.recipient,
      args.amount
    );
    await transferFrom.wait();

    console.log(
      "transfered from",
      args.sender,
      "to",
      args.recipient,
      "amount: ",
      args.amount
    );
  });

task("transfer", "Transfer from one to another")
  .addParam("recipient", "recipient")
  .addParam("amount", "amount")
  .setAction(async (args, hre) => {
    const ERC20 = await hre.ethers.getContractFactory("ERC20");
    const erc20 = await ERC20.deploy("MyToken", "MTKN", 18);

    await erc20.deployed();

    const transferFrom = await erc20.transferFrom(
      args.sender,
      args.recipient,
      args.amount
    );
    await transferFrom.wait();

    const transfer = await erc20.transfer(args.recipient, args.amount);

    await transfer.wait();

    console.log("transfered to", args.recipient, "amount: ", args.amount);
  });

task("approve", "Approve amount")
  .addParam("sender", "sender")
  .addParam("amount", "amount")
  .setAction(async (args, hre) => {
    const ERC20 = await hre.ethers.getContractFactory("ERC20");
    const erc20 = await ERC20.deploy("MyToken", "MTKN", 18);

    await erc20.deployed();

    const transferFrom = await erc20.transferFrom(
      args.sender,
      args.recipient,
      args.amount
    );
    await transferFrom.wait();

    await erc20.approve(args.sender, args.amount);

    console.log("approved", args.sender, "amount: ", args.amount);
  });

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
