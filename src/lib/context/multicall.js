import { Provider } from "ethers-multicall";
import { Contract as MulticallContract } from "ethers-multicall";
import { SFI_CONTRACT } from "lib/contracts";
import { allPools, currentEpoch } from "lib/config/poolInfo";
import { PoolType } from "lib/config/constant";
import BigNumber from "bignumber.js";
import NProgress from "nprogress";

//ABI import
import ERC20ABI from "lib/config/abi/ERC20.json";
import SaffronPoolABI from "lib/config/abi/SaffronPool.json";
import UniV2PairABI from "lib/config/abi/UniV2Pair.json";
import SaffronERC20StakingPoolABI from "lib/config/abi/SaffronERC20StakingPool.json";

export const loadContractData = async (library, account) => {
  const provider = new Provider(library);
  await provider.init();

  const sfiToken = new MulticallContract(SFI_CONTRACT, ERC20ABI);

  // initialize multicall
  let multicallArray = [];
  let _pools = [...allPools];
  _pools.forEach((poolsPerEpoch, epoch) => {
    if (epoch === 1) return;
    poolsPerEpoch.forEach((pool, index) => {
      let currentPool = { ..._pools[epoch][index] };
      if (pool.type === PoolType.Tranche) {
        const tranchePool = new MulticallContract(pool.address, SaffronPoolABI);
        currentPool.base_asset_address = multicallArray.length;
        currentPool.tranche_A_multiplier = multicallArray.length + 1;
        currentPool.sfi_balance = multicallArray.length + 2;
        multicallArray.push(
          ...[tranchePool.base_asset_address(), tranchePool.tranche_A_multiplier(), sfiToken.balanceOf(pool.address)]
        );
        currentPool.tranche = {};
        pool.detail.forEach((tranche) => {
          currentPool.tranche[tranche] = {
            tranche_total_principal: multicallArray.length,
            principal_token_addresses: multicallArray.length + 1,
            dsec_token_addresses: multicallArray.length + 2,
          };
          multicallArray.push(
            ...[
              tranchePool.tranche_total_principal(epoch, tranche),
              tranchePool.principal_token_addresses(epoch, tranche),
              tranchePool.dsec_token_addresses(epoch, tranche),
            ]
          );

          if (epoch < currentEpoch) {
            currentPool.tranche[tranche].tranche_interest_earned = multicallArray.length;
            currentPool.tranche[tranche].tranche_SFI_earned = multicallArray.length + 1;
            multicallArray.push(
              ...[tranchePool.tranche_interest_earned(epoch, tranche), tranchePool.tranche_SFI_earned(epoch, tranche)]
            );
          }
        });
        if (epoch === currentEpoch) {
          currentPool.SFI_ratio = multicallArray.length;
          multicallArray.push(tranchePool.SFI_ratio());
        }
      } else {
        const erc20StakingPool = new MulticallContract(pool.address, SaffronERC20StakingPoolABI);
        currentPool.dsec_token_addresses = multicallArray.length;
        multicallArray.push(erc20StakingPool.dsec_token_addresses(epoch));

        currentPool.base_asset_address = multicallArray.length;
        multicallArray.push(erc20StakingPool.base_asset_address());
        if (epoch < currentEpoch) {
          currentPool.SFI_earned = multicallArray.length;
          multicallArray.push(erc20StakingPool.SFI_earned(epoch));
        }
        currentPool.principal_token_addresses = multicallArray.length;
        currentPool.pool_principal = multicallArray.length + 1;
        multicallArray.push(...[erc20StakingPool.principal_token_addresses(epoch), erc20StakingPool.pool_principal()]);
      }
      _pools[epoch][index] = currentPool;
    });
  });
  let res = await provider.all(multicallArray);
  NProgress.inc();
  //end multicall
  _pools.forEach((poolsPerEpoch, epoch) => {
    if (epoch === 1) return;
    poolsPerEpoch.forEach((pool, index) => {
      let currentPool = { ..._pools[epoch][index] };
      if (pool.type === PoolType.Tranche) {
        currentPool.base_asset_address = res[currentPool.base_asset_address];
        currentPool.tranche_A_multiplier = res[currentPool.tranche_A_multiplier].toNumber();
        currentPool.sfi_balance = res[currentPool.sfi_balance].toString();

        pool.detail.forEach((tranche) => {
          currentPool.tranche[tranche].tranche_total_principal = res[
            currentPool.tranche[tranche].tranche_total_principal
          ].toString();

          currentPool.tranche[tranche].principal_token_addresses =
            res[currentPool.tranche[tranche].principal_token_addresses];

          currentPool.tranche[tranche].dsec_token_addresses = res[currentPool.tranche[tranche].dsec_token_addresses];

          if (epoch < currentEpoch) {
            currentPool.tranche[tranche].tranche_interest_earned = res[
              currentPool.tranche[tranche].tranche_interest_earned
            ].toString();
            currentPool.tranche[tranche].tranche_SFI_earned = res[
              currentPool.tranche[tranche].tranche_SFI_earned
            ].toString();
          }
        });
        if (epoch === currentEpoch) {
          currentPool.SFI_ratio = res[currentPool.SFI_ratio].toString();
        }
      } else {
        currentPool.dsec_token_addresses = res[currentPool.dsec_token_addresses];
        currentPool.base_asset_address = res[currentPool.base_asset_address];
        if (epoch < currentEpoch) {
          currentPool.SFI_earned = res[currentPool.SFI_earned].toString();
        }
        currentPool.principal_token_addresses = res[currentPool.principal_token_addresses];
        currentPool.pool_principal = res[currentPool.pool_principal].toString();
      }
      _pools[epoch][index] = currentPool;
    });
  });
  // get dsec rate, base decimal, balance of lp,
  multicallArray = [];

  _pools.forEach((poolsPerEpoch, epoch) => {
    if (epoch === 1) return;
    poolsPerEpoch.forEach((pool, index) => {
      let currentPool = { ..._pools[epoch][index] };
      if (pool.type === PoolType.Tranche) {
        const base_asset = new MulticallContract(currentPool.base_asset_address, ERC20ABI);
        currentPool.base_asset_decimal = multicallArray.length;
        multicallArray.push(base_asset.decimals());
        pool.detail.forEach((tranche) => {
          const principal_token = new MulticallContract(
            currentPool.tranche[tranche].principal_token_addresses,
            ERC20ABI
          );
          const dsec_token = new MulticallContract(currentPool.tranche[tranche].dsec_token_addresses, ERC20ABI);
          currentPool.tranche[tranche] = {
            ...currentPool.tranche[tranche],
            balanceOfLp: multicallArray.length,
            dsec_token_balance: multicallArray.length + 1,
            dsec_token_totalSupply: multicallArray.length + 2,
          };
          multicallArray.push(
            ...[principal_token.balanceOf(account), dsec_token.balanceOf(account), dsec_token.totalSupply()]
          );
        });
      } else {
        const dsec_token = new MulticallContract(currentPool.dsec_token_addresses, ERC20ABI);
        currentPool.dsec_token_balance = multicallArray.length;
        currentPool.dsec_token_totalSupply = multicallArray.length + 1;
        multicallArray.push(...[dsec_token.balanceOf(account), dsec_token.totalSupply()]);

        currentPool.base_asset_decimal = 18;

        const principal_token = new MulticallContract(currentPool.principal_token_addresses, ERC20ABI);
        currentPool.balanceOfLp = multicallArray.length;
        multicallArray.push(principal_token.balanceOf(account));

        if (pool.type === PoolType.UniPool || pool.type === PoolType.SushiPool) {
          const pairContract = new MulticallContract(currentPool.base_asset_address, UniV2PairABI);
          currentPool.pairTotalSupply = multicallArray.length;
          currentPool.pairReserves = multicallArray.length + 1;
          multicallArray.push(...[pairContract.totalSupply(), pairContract.getReserves()]);
        }
      }
      _pools[epoch][index] = currentPool;
    });
  });

  res = await provider.all(multicallArray);
  NProgress.inc();

  _pools.forEach((poolsPerEpoch, epoch) => {
    if (epoch === 1) return;
    poolsPerEpoch.forEach((pool, index) => {
      let currentPool = { ..._pools[epoch][index] };
      if (pool.type === PoolType.Tranche) {
        currentPool.base_asset_decimal = res[currentPool.base_asset_decimal];
        pool.detail.forEach((tranche) => {
          currentPool.tranche[tranche].balanceOfLp = res[currentPool.tranche[tranche].balanceOfLp].toString();

          currentPool.tranche[tranche].dsec_token_balance = res[
            currentPool.tranche[tranche].dsec_token_balance
          ].toString();

          currentPool.tranche[tranche].dsec_token_totalSupply = res[
            currentPool.tranche[tranche].dsec_token_totalSupply
          ].toString();

          currentPool.tranche[tranche].dsec_rate =
            new BigNumber(currentPool.tranche[tranche].dsec_token_totalSupply).isZero() ||
            new BigNumber(currentPool.tranche[tranche].dsec_token_totalSupply).isNaN()
              ? 0
              : new BigNumber(currentPool.tranche[tranche].dsec_token_balance)
                  .dividedBy(currentPool.tranche[tranche].dsec_token_totalSupply)
                  .toString();
        });
      } else {
        currentPool.dsec_token_balance = res[currentPool.dsec_token_balance].toString();
        currentPool.dsec_token_totalSupply = res[currentPool.dsec_token_totalSupply].toString();

        currentPool.dsec_rate =
          new BigNumber(currentPool.dsec_token_totalSupply).isZero() ||
          new BigNumber(currentPool.dsec_token_totalSupply).isNaN()
            ? 0
            : new BigNumber(currentPool.dsec_token_balance).dividedBy(currentPool.dsec_token_totalSupply).toString();

        currentPool.balanceOfLp = res[currentPool.balanceOfLp].toString();

        if (pool.type === PoolType.UniPool || pool.type === PoolType.SushiPool) {
          currentPool.pairTotalSupply = res[currentPool.pairTotalSupply].toString();
          currentPool.pairReserves = res[currentPool.pairReserves];
        }
      }
      _pools[epoch][index] = currentPool;
    });
  });
  return _pools;
};
