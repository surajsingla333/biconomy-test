var TimeLockedWalletFactory = artifacts.require("TimeLockedWalletFactory");
var BiconomyToken = artifacts.require("BiconomyToken");

module.exports = function (deployer) {
  deployer.deploy(TimeLockedWalletFactory);
  deployer.deploy(BiconomyToken);
};
