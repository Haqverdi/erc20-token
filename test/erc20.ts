import { expect } from "chai";
import { ethers } from "hardhat";

let token: any, initialHolder: any, recipient: any, anotherAccount: any;

const amount = ethers.utils.parseEther("1.0");
const name = "mytoken";
const symbol = "MTKN";
const decimals = 18;

async function init() {
  const [_initialHolder, _recipient, _anotherAccount] =
    await ethers.getSigners();

  const ERC20 = await ethers.getContractFactory("ERC20", _initialHolder);
  const erc20 = await ERC20.deploy(name, symbol, decimals);

  await erc20.deployed();

  token = erc20;
  initialHolder = _initialHolder;
  recipient = _recipient;
  anotherAccount = _anotherAccount;
}

beforeEach(async () => {
  await init();
});

describe("ERC20", function () {
  it("Should return the name of token", async function () {
    expect(await token.name()).to.equal(name);
  });
  it("Should return the symbol of token", async function () {
    expect(await token.symbol()).to.equal(symbol);
  });
  it("Should return the decimals of token", async function () {
    expect(await token.decimals()).to.equal(decimals);
  });

  it("Should transfer from the sender amount", async function () {
    const transferFrom = await token.transferFrom(
      initialHolder.address,
      recipient.address,
      amount
    );
    await transferFrom.wait();

    const balanceOf = ethers.utils.formatEther(
      await token.connect(initialHolder).balanceOf(recipient.address)
    );

    expect(balanceOf).to.equal("1.0");
  });

  it("Should transfer from one to another", async function () {
    const transferFrom = await token.transferFrom(
      initialHolder.address,
      recipient.address,
      amount
    );
    await transferFrom.wait();

    const transfer = await token.transfer(anotherAccount.address, amount);

    await transfer.wait();

    const balanceOf = ethers.utils.formatEther(
      await token.connect(anotherAccount).balanceOf(recipient.address)
    );

    expect(balanceOf).to.equal("1.0");
  });

  it("Should approve amount", async function () {
    const transferFrom = await token.transferFrom(
      initialHolder.address,
      recipient.address,
      amount
    );
    await transferFrom.wait();

    const approve = await token.approve(recipient.address, amount);

    const approveValue = ethers.utils.formatEther(approve.value);

    expect(approveValue).to.equal("0.0");
  });

  it("Should burn", async function () {
    const mint = await token.mint(amount);
    await mint.wait();

    const burn = await token.burn(amount);
    await burn.wait();

    const total = await token.totalSupply();

    expect(ethers.utils.formatEther(total)).to.equal("0.0");
  });

  it("Should mint", async function () {
    const mint = await token.mint(amount);
    await mint.wait();

    const total = await token.totalSupply();

    expect(ethers.utils.formatEther(total)).to.equal("1.0");
  });
});
