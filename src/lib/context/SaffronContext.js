import { createContext, useContext, useState, useEffect } from "react";
import { SaffronPool, SaffronERC20StakingPool } from "lib/contracts";
import NProgress from "nprogress";
import { useAPIData } from "lib/utils/hooks";
import { fromWei } from "lib/utils";
import { useWeb3React } from "@web3-react/core";
import { currentPools, currentEpoch, currentStrategy } from "lib/config/poolInfo";
import { PoolType, Tranche } from "lib/config/constant";
import { NETWORKID } from "lib/config/constant";
import _ from "lodash";
import BigNumber from "bignumber.js";
import { loadContractData } from "./multicall";
import { Provider } from "ethers-multicall";
import { Contract as MulticallContract } from "ethers-multicall";
import { SFI_CONTRACT } from "lib/contracts";
import ERC20ABI from "lib/config/abi/ERC20.json";
import SaffronStrategyABI from "lib/config/abi/SaffronStrategy.json";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

NProgress.configure({ showSpinner: false, speed: 100 });

export const SaffronContext = createContext();
export const useSaffronContext = () => useContext(SaffronContext);

export const SaffronContextProvider = ({ children }) => {
  const { library, chainId, account } = useWeb3React();
  const { t } = useTranslation();

  const _currentPools = currentPools
    .filter((pool) => pool.type !== PoolType.Adaptor)
    .map((pool) => ({
      index: pool.index,
      name: pool.name,
      pair: pool.pair,
      type: pool.type,
      reward: pool.reward,
      ...(pool.detail
        ? {
            detail: pool.detail,
          }
        : {}),
    }));

  const [balance, setBalance] = useState(0);
  const [portfolio, setPortfolio] = useState(0);
  const [pools, setPools] = useState([..._currentPools]);
  const [saffronTVL, setSaffronTVL] = useState({
    total: new BigNumber(0),
  });
  const [highApyIndex, setHighApyIndex] = useState(0);
  const [highApy, setHighApy] = useState(0);
  const [interestEarnedTotal, setInterestEarnedTotal] = useState(0);
  const [sfiEarnedTotal, setSfiEarnedTotal] = useState(0);
  const [interestEstimatedTotal, setInterestEstimatedTotal] = useState(0);
  const [sfiEstimatedTotal, setSfiEstimatedTotal] = useState(0);
  const [epochEnd, setEpochEnd] = useState(0);
  const [epochStart, setEpochStart] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const apiData = useAPIData();
  const { price, saffronData } = apiData;

  const getPrice = (tag) => {
    if (!price || !tag) return 0;
    return price[tag] ? price[tag].usd ?? 0 : 0;
  };
  const saffronPrice = getPrice("saffron-finance");

  const loadPools = async () => {
    if (!price || !saffronData) return;
    if (!library || !account || !chainId || chainId !== NETWORKID) return;

    const provider = new Provider(library);
    await provider.init();

    const sfiToken = new MulticallContract(SFI_CONTRACT, ERC20ABI);
    const strategy = new MulticallContract(currentStrategy, SaffronStrategyABI);
    const [balance, epochEnd, epochStart] = await provider.all([
      sfiToken.balanceOf(account),
      strategy.get_epoch_end(currentEpoch),
      strategy.get_epoch_end(currentEpoch - 1),
    ]);

    const _balance = fromWei(balance.toString());
    setBalance(new BigNumber(_balance).toFixed());
    setEpochEnd(epochEnd.toNumber());
    setEpochStart(epochStart.toNumber() + 1);

    let _pools = [];
    let saffronTVL = { total: new BigNumber(0) };
    let interest_earned_total = new BigNumber(0);
    let sfi_earned_total = new BigNumber(0);
    let interest_estimated_total = new BigNumber(0);
    let sfi_estimated_total = new BigNumber(0);
    let _portfolio = new BigNumber(0);

    _pools = pools.map((pool) => ({
      ...pool,
      redeemable_epoch: [],
      tvl: { total: {} },
      dsec_token: {},
      principal_token: {},
      sfi_redeemable: { total: {} },
      principal: {},
    }));

    toast.loading(loaded ? t("notify.refreshing") : t("notify.loading"), {
      duration: 3000,
    });

    NProgress.start();
    const allPools = await loadContractData(library, account);

    await Promise.all(
      allPools.map(async (poolsPerEpoch, index) => {
        if (index === 1) return;
        const epoch = index;
        if (!saffronTVL[epoch]) saffronTVL[epoch] = new BigNumber(0);

        await Promise.all(
          poolsPerEpoch.map(async (pool) => {
            if (chainId !== NETWORKID) return;
            try {
              let sfi_redeemable_per_epoch = new BigNumber(0);
              let user_interest_redeemable = new BigNumber(0);
              const index = _.findIndex(_pools, { name: pool.name });

              if (!_pools[index].dsec_token[epoch]) _pools[index].dsec_token[epoch] = {};
              if (!_pools[index].tvl[epoch]) _pools[index].tvl[epoch] = {};

              if (pool.type === PoolType.Tranche) {
                ///tranche pool
                if (!_pools[index].principal_token[epoch]) _pools[index].principal_token[epoch] = {};
                if (!_pools[index].contract) _pools[index].contract = {};

                _pools[index].contract[epoch] = new SaffronPool(pool.address, library.getSigner());
                const base_assets_decimal = pool.base_asset_decimal;
                const tranchePrice = getPrice(pool.pair[0].tag);
                const trancheAMultiplier = pool.tranche_A_multiplier;
                _pools[index].trancheAMultiplier = trancheAMultiplier;

                let balanceOfLpPerTranche = {};
                let balanceOfLpPerTrancheUSD = {};
                let interest_estimated_per_pool = new BigNumber(0);
                let sfi_estimated_per_pool = new BigNumber(0);
                if (!_pools[index].interest_redeemable) _pools[index].interest_redeemable = { total: {} };

                await Promise.all(
                  pool.detail.map(async (tranche) => {
                    const totalPrincipal = fromWei(pool.tranche[tranche].tranche_total_principal, base_assets_decimal);

                    //tvl calculation

                    const principalUSD = totalPrincipal.multipliedBy(tranchePrice);
                    if (tranche === Tranche.A) {
                      const holdingSFI = fromWei(pool.sfi_balance);
                      const holdingSFIUsd = holdingSFI.multipliedBy(saffronPrice);
                      _pools[index].tvl[epoch][tranche] = {
                        token0: totalPrincipal.toFixed(),
                        sfi: holdingSFI.toFixed(),
                        usd: new BigNumber(principalUSD).plus(holdingSFIUsd).toFixed(),
                      };
                    } else
                      _pools[index].tvl[epoch][tranche] = {
                        token0: totalPrincipal.toFixed(),
                        usd: principalUSD.toFixed(),
                      };

                    if (!_pools[index].tvl["total"][tranche]) _pools[index].tvl["total"][tranche] = 0;
                    _pools[index].tvl["total"][tranche] = new BigNumber(_pools[index].tvl["total"][tranche])
                      .plus(_pools[index].tvl[epoch][tranche].usd)
                      .toFixed();

                    saffronTVL[epoch] = saffronTVL[epoch].plus(_pools[index].tvl[epoch][tranche].usd);
                    saffronTVL.total = saffronTVL.total.plus(_pools[index].tvl[epoch][tranche].usd);
                    //end tvl calculation

                    //principal calculation
                    const principal = fromWei(pool.tranche[tranche].balanceOfLp);

                    if (!_pools[index].principal[epoch]) _pools[index].principal[epoch] = {};
                    _pools[index].principal[epoch][tranche] = principal.toFixed();

                    if (!_pools[index].principal["total"]) _pools[index].principal["total"] = {};

                    _pools[index].principal["total"][tranche] = new BigNumber(
                      _pools[index].principal["total"][tranche] ?? 0
                    )
                      .plus(principal)
                      .toFixed();

                    //end principal calculation
                    const dsec_token_address = pool.tranche[tranche].dsec_token_addresses;
                    _pools[index].dsec_token[epoch][tranche] = dsec_token_address;

                    const principal_token_address = pool.tranche[tranche].principal_token_addresses;
                    _pools[index].principal_token[epoch][tranche] = principal_token_address;

                    const dsec_rate = pool.tranche[tranche].dsec_rate;
                    if (epoch === currentEpoch) {
                      //lp token balance calculate
                      balanceOfLpPerTranche[tranche] = principal;
                      balanceOfLpPerTrancheUSD[tranche] = new BigNumber(principal).multipliedBy(tranchePrice).toFixed();

                      _portfolio = _portfolio.plus(balanceOfLpPerTrancheUSD[tranche]);
                      //end lp token balance calculation

                      //interest_estimated calculation
                      const trancheSymbol = ["S", "AA", "A"];
                      const tranchesObj = saffronData.pools
                        ? saffronData.pools[pool.index]
                          ? saffronData.pools[pool.index].tranches[trancheSymbol[tranche]]
                          : 0
                        : 0;
                      const apy = tranchesObj ? tranchesObj[pool.pair[0].name.toLowerCase() + "-apy"] ?? 0 : 0;

                      const poolapy = tranchesObj
                        ? tranchesObj[pool.pair[0].name.toLowerCase() + "-comp-apy"] ??
                          tranchesObj[pool.pair[0].name.toLowerCase() + "-apy"] ??
                          0
                        : 0;
                      const totalApy = tranchesObj["total-apy"];

                      if (!_pools[index].apy) _pools[index].apy = {};
                      _pools[index].apy[tranche] = poolapy;

                      if (!_pools[index].total_apy) _pools[index].total_apy = {};
                      _pools[index].total_apy[tranche] = totalApy;

                      const trancheEstimated = totalPrincipal
                        .multipliedBy(apy)
                        .multipliedBy(14 / 365)
                        .multipliedBy(dsec_rate)
                        .multipliedBy(tranchePrice);
                      interest_estimated_per_pool = new BigNumber(interest_estimated_per_pool).plus(
                        trancheEstimated.toString()
                      );
                      //end interest_estimated calculation

                      //sfi estimate calculation
                      const sfi_estimated = new BigNumber(pool.reward).multipliedBy(dsec_rate);
                      sfi_estimated_per_pool = sfi_estimated_per_pool.plus(sfi_estimated);
                      //end estimate calculation
                    } else {
                      //tranche interest earned calculation
                      const tranche_interest_earned = pool.tranche[tranche].tranche_interest_earned;

                      const user_interest_redeemable_per_tranche = fromWei(
                        tranche_interest_earned,
                        base_assets_decimal
                      ).multipliedBy(dsec_rate);

                      if (!_pools[index].interest_redeemable[epoch]) _pools[index].interest_redeemable[epoch] = {};

                      _pools[index].interest_redeemable[epoch][
                        tranche
                      ] = user_interest_redeemable_per_tranche.toFixed();

                      user_interest_redeemable = user_interest_redeemable.plus(user_interest_redeemable_per_tranche);
                      //end tranche interest calculation

                      //sfi earned calculation
                      const tranche_sfi_earned = fromWei(pool.tranche[tranche].tranche_SFI_earned, 18);
                      const sfi_redeemable_per_tranche = tranche_sfi_earned.multipliedBy(dsec_rate);
                      if (!_pools[index].sfi_redeemable[epoch]) _pools[index].sfi_redeemable[epoch] = {};
                      _pools[index].sfi_redeemable[epoch][tranche] = sfi_redeemable_per_tranche.toFixed();

                      sfi_redeemable_per_epoch = sfi_redeemable_per_epoch.plus(sfi_redeemable_per_tranche);
                      //end sfi earned calculation
                    }
                  })
                );
                if (epoch === currentEpoch) {
                  //lp token balance set
                  const SFI_RATIO = fromWei(pool.SFI_ratio, base_assets_decimal).toNumber();

                  _pools[index].lpBalance = { ...balanceOfLpPerTranche };
                  _pools[index].lpBalanceUSD = { ...balanceOfLpPerTrancheUSD };

                  _pools[index].sfi_ratio = SFI_RATIO;
                  _pools[index].sfi_staked =
                    new BigNumber(SFI_RATIO).isZero() || new BigNumber(SFI_RATIO).isNaN()
                      ? 0
                      : new BigNumber(balanceOfLpPerTranche[Tranche.A]).dividedBy(SFI_RATIO).toFixed();

                  _pools[index].interest_estimated = interest_estimated_per_pool.toFixed();
                  _pools[index].sfi_estimated = sfi_estimated_per_pool.toFixed();

                  sfi_estimated_total = sfi_estimated_total.plus(sfi_estimated_per_pool);

                  interest_estimated_total = interest_estimated_total.plus(interest_estimated_per_pool);
                  //end
                } else if (epoch < currentEpoch) {
                  //interest_earned_redeemable total calculation
                  _pools[index].redeemable_epoch.push(epoch);
                  _pools[index].redeemable_epoch.sort((a, b) => a - b);

                  _pools[index].interest_redeemable.total["token"] = new BigNumber(
                    _pools[index].interest_redeemable.total["token"] ?? 0
                  )
                    .plus(user_interest_redeemable)
                    .toFixed();

                  const interest_redeemable_usd = new BigNumber(user_interest_redeemable).multipliedBy(tranchePrice);

                  _pools[index].interest_redeemable.total["usd"] = new BigNumber(
                    _pools[index].interest_redeemable.total["usd"] ?? 0
                  )
                    .plus(interest_redeemable_usd)
                    .toFixed();

                  interest_earned_total = interest_earned_total.plus(interest_redeemable_usd);
                  //end interest_earned_redeemable total calculation
                }
              } else {
                //uniswap and sushiswap pool
                if (!_pools[index].contract) _pools[index].contract = {};
                _pools[index].contract[epoch] = new SaffronERC20StakingPool(pool.address, library.getSigner());
                if (epoch < currentEpoch) {
                  const dsec_rate = pool.dsec_rate;
                  const sfi_earned = fromWei(pool.SFI_earned, 18);

                  sfi_redeemable_per_epoch = new BigNumber(sfi_earned).multipliedBy(dsec_rate);

                  if (!_pools[index].sfi_redeemable[epoch]) _pools[index].sfi_redeemable[epoch] = new BigNumber(0);
                  _pools[index].sfi_redeemable[epoch] = sfi_redeemable_per_epoch.toFixed();

                  _pools[index].redeemable_epoch.push(epoch);
                  _pools[index].redeemable_epoch.sort((a, b) => a - b);
                } else if (epoch === currentEpoch) {
                  const dataObj = saffronData.pools ? saffronData.pools[pool.index] ?? 0 : 0;
                  const sfi_apy = dataObj ? dataObj["sfi-apy"] ?? 0 : 0;
                  _pools[index].sfi_apy = sfi_apy;
                  const dsec_rate = pool.dsec_rate;
                  const sfi_estimated = new BigNumber(pool.reward).multipliedBy(dsec_rate);
                  _pools[index].sfi_estimated = sfi_estimated.toFixed();
                }

                const principal = pool.balanceOfLp;

                _pools[index].principal[epoch] = fromWei(principal).toFixed();

                _pools[index].principal["total"] = new BigNumber(_pools[index].principal["total"] ?? 0)
                  .plus(_pools[index].principal[epoch])
                  .toFixed();

                const dsec_token_address = pool.dsec_token_addresses;
                _pools[index].dsec_token[epoch] = dsec_token_address;

                const principal_token_address = pool.principal_token_addresses;
                _pools[index].principal_token[epoch] = principal_token_address;

                const totalPrincipal = pool.pool_principal;
                //end principal calculation
                if (pool.type === PoolType.StakingPool) {
                  if (epoch === currentEpoch) {
                    _pools[index].lpBalance = fromWei(principal);
                    _pools[index].lpBalanceUSD = new BigNumber(_pools[index].lpBalance)
                      .multipliedBy(saffronPrice)
                      .toFixed();
                    _portfolio = _portfolio.plus(_pools[index].lpBalanceUSD);
                  }

                  _pools[index].tvl[epoch] = {
                    sfi: fromWei(totalPrincipal).toFixed(),
                    usd: fromWei(totalPrincipal).multipliedBy(saffronPrice).toFixed(),
                  };
                  if (_.isEmpty(_pools[index].tvl["total"]))
                    _pools[index].tvl["total"] = { sfi: new BigNumber(0), usd: new BigNumber(0) };
                  _pools[index].tvl["total"]["sfi"] = new BigNumber(_pools[index].tvl["total"]["sfi"])
                    .plus(_pools[index].tvl[epoch].sfi)
                    .toFixed();

                  _pools[index].tvl["total"]["usd"] = new BigNumber(_pools[index].tvl["total"]["usd"])
                    .plus(_pools[index].tvl[epoch].usd)
                    .toFixed();

                  saffronTVL[epoch] = saffronTVL[epoch].plus(_pools[index].tvl[epoch].usd);

                  saffronTVL.total = saffronTVL.total.plus(_pools[index].tvl[epoch].usd);
                } else if (pool.type === PoolType.UniPool || pool.type === PoolType.SushiPool) {
                  _pools[index].pairAddress = pool.base_asset_address;

                  const pairTotalSupply = pool.pairTotalSupply;
                  const reserves = pool.pairReserves;

                  const token0 = pool.pair[0],
                    token1 = pool.pair[1];

                  const tvlPercent =
                    new BigNumber(pairTotalSupply).isZero() || new BigNumber(pairTotalSupply).isNaN()
                      ? 0
                      : new BigNumber(totalPrincipal).dividedBy(pairTotalSupply);
                  const token0Reserve = tvlPercent.multipliedBy(fromWei(reserves[0].toString(), token0.decimals));
                  const token1Reserve = tvlPercent.multipliedBy(fromWei(reserves[1].toString(), token1.decimals));
                  const token0Usd = token0Reserve.multipliedBy(getPrice(token0.tag));
                  const token1Usd = token1Reserve.multipliedBy(getPrice(token1.tag));

                  const exchangeTVL = token0Usd.plus(token1Usd);

                  _pools[index].tvl[epoch] = {
                    token0: {
                      name: token0.name,
                      reserve: token0Reserve.toFixed(),
                      usd: token0Usd.toFixed(),
                    },
                    token1: {
                      name: token1.name,
                      reserve: token1Reserve.toFixed(),
                      usd: token1Usd.toFixed(),
                    },
                    usd: exchangeTVL.toFixed(),
                  };
                  const poolTvl = _pools[index].tvl["total"];
                  if (_.isEmpty(poolTvl)) _pools[index].tvl["total"] = { token0: {}, token1: {}, usd: 0 };
                  _pools[index].tvl["total"] = {
                    token0: {
                      name: token0.name,
                      reserve: new BigNumber(_pools[index].tvl["total"]["token0"].reserve ?? 0)
                        .plus(_pools[index].tvl[epoch].token0.reserve)
                        .toFixed(),
                      usd: new BigNumber(_pools[index].tvl["total"]["token0"].reserve ?? 0)
                        .plus(_pools[index].tvl[epoch].token0.usd)
                        .toFixed(),
                    },
                    token1: {
                      name: token1.name,
                      reserve: new BigNumber(_pools[index].tvl["total"]["token1"].reserve ?? 0)
                        .plus(_pools[index].tvl[epoch].token1.reserve)
                        .toFixed(),
                      usd: new BigNumber(_pools[index].tvl["total"]["token1"].reserve ?? 0)
                        .plus(_pools[index].tvl[epoch].token1.usd)
                        .toFixed(),
                    },
                    usd: new BigNumber(_pools[index].tvl["total"]["usd"] ?? 0).plus(exchangeTVL).toFixed(),
                  };

                  saffronTVL[epoch] = saffronTVL[epoch].plus(exchangeTVL);
                  saffronTVL.total = saffronTVL.total.plus(exchangeTVL);

                  if (epoch === currentEpoch) {
                    const percent =
                      new BigNumber(pairTotalSupply).isZero() || new BigNumber(pairTotalSupply).isNaN()
                        ? 0
                        : new BigNumber(principal).dividedBy(pairTotalSupply).toFixed();
                    const token0Balance = fromWei(reserves[0].toString(), token0.decimals).multipliedBy(percent);
                    const token1Balance = fromWei(reserves[1].toString(), token1.decimals).multipliedBy(percent);
                    _pools[index].lpBalance = [token0Balance.toFixed(), token1Balance.toFixed()];

                    const pair0Balance = token0Balance.multipliedBy(getPrice(pool.pair[0].tag)).toFixed();
                    const pair1Balance = token1Balance.multipliedBy(getPrice(pool.pair[1].tag)).toFixed();
                    _pools[index].lpBalanceUSD = [pair0Balance, pair1Balance];

                    _portfolio = _portfolio.plus(pair0Balance).plus(pair1Balance);
                  }
                }
              }

              //sfi_earned_redeemable total calculation
              const sfi_redeemable_per_epoch_usd = sfi_redeemable_per_epoch.multipliedBy(saffronPrice).toFixed();
              _pools[index].sfi_redeemable.total["sfi"] = new BigNumber(_pools[index].sfi_redeemable.total["sfi"] ?? 0)
                .plus(sfi_redeemable_per_epoch)
                .toFixed();

              _pools[index].sfi_redeemable.total["usd"] = new BigNumber(_pools[index].sfi_redeemable.total["usd"] ?? 0)
                .plus(sfi_redeemable_per_epoch_usd)
                .toFixed();
              sfi_earned_total = sfi_earned_total.plus(sfi_redeemable_per_epoch_usd ?? 0);
              //end sfi_earned_redeemable total calculation
            } catch (error) {
              console.error(error);
              return;
            }
          })
        );
      })
    );

    try {
      const compareArray = [];
      _pools.forEach((pool, index) => {
        if (pool.type === PoolType.Tranche) {
          compareArray.push(...Object.values(pool.apy).map((apy) => ({ apy, index })));
        } else {
          compareArray.push({ apy: pool.sfi_apy, index });
        }
        const maxApyPool = compareArray.reduce((a, b) => (new BigNumber(a.apy).isGreaterThanOrEqualTo(b.apy) ? a : b));
        setHighApyIndex(maxApyPool.index);
        setHighApy(maxApyPool.apy);
      });
    } catch (err) {
      console.error(err);
    }
    console.log(_pools);
    setPools(_pools);
    setPortfolio(_portfolio.toFixed());
    setSaffronTVL(saffronTVL);
    setInterestEarnedTotal(interest_earned_total.toFixed());
    setSfiEarnedTotal(sfi_earned_total.toFixed());
    setInterestEstimatedTotal(interest_estimated_total.toFixed());
    setSfiEstimatedTotal(sfi_estimated_total.toFixed());
    if (!loaded) {
      setLoaded(true);
    }
    NProgress.done();
  };

  useEffect(() => {
    loadPools();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [library, account, apiData, lastUpdated]);
  const refresh = () => {
    setLastUpdated(Math.round(new Date() / 1000));
  };
  return (
    <SaffronContext.Provider
      value={{
        getPrice,
        refresh,
        epochEnd,
        pools,
        highApyIndex,
        saffronTVL,
        epochStart,
        loaded,
        saffronPrice,
        highApy,
        interestEarnedTotal,
        sfiEarnedTotal,
        sfiEstimatedTotal,
        interestEstimatedTotal,
        balance,
        portfolio,
        currentEpoch,
        saffronData,
      }}
    >
      {children}
    </SaffronContext.Provider>
  );
};
