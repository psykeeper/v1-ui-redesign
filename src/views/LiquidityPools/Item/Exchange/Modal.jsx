import { IconGroupWrapper } from "components/Common/Wrapper";
import { Paper, FlexBox } from "components/Common/Box";
import { Modal, Input, PopInfo, Slider } from "components/Common";
import { Typography } from "components/Common/Statistic";
import { Button } from "components/Common/Button";
import { Row, Col, Radio } from "antd";
import { useEffect, useMemo, useState, useCallback } from "react";
import { PoolType } from "lib/config/constant";
import { toTimezoneFormat, fromWei, toWei } from "lib/utils/helper";
import { useWeb3React } from "@web3-react/core";
import { ERC20, UniV2Router, SushiRouter, UniV2Pair } from "lib/contracts";
import BigNumber from "bignumber.js";
import { MAXUINT256, WETH } from "lib/config/constant";
import Loader from "react-loader-spinner";
import { useSaffronContext } from "lib/context";
import { CheckMark, DenyMark } from "components/Common/Icon";
import Skeleton from "components/Common/Skeleton";
import { useTranslation } from "react-i18next";
import {printf} from "lib/utils/helper";


const DepositModal = ({ visible, pool, showModal }) => {
  const { pair } = pool;
  const { t } = useTranslation();
  const icons = pair.map((tokens) => tokens.icon);
  const { currentEpoch, epochEnd } = useSaffronContext();
  const [slippage, setSlippage] = useState(5);
  const [deadline, setDeadline] = useState(20);
  const lpSymbol = pool.type === PoolType.UniPool ? "UNI-V2" : "SLP";
  const swapName = pool.type === PoolType.UniPool ? "Uniswap" : "Sushiswap";
  const { account, library } = useWeb3React();

  const [lpAmount, setLpAmount] = useState(0);
  const [token0Amount, setToken0Amount] = useState(0);
  const [token1Amount, setToken1Amount] = useState(0);
  const [lpBalance, setLpBalance] = useState(0);
  const [token0Balance, setToken0Balance] = useState(0);
  const [token1Balance, setToken1Balance] = useState(0);

  const [token0Decimal, setToken0Decimal] = useState(0);
  const [token1Decimal, setToken1Decimal] = useState(0);

  const [swalVisible, setSwalVisible] = useState(false);
  const [errorText0, setErrorText0] = useState("");
  const [errorText1, setErrorText1] = useState("");
  const [errorText2, setErrorText2] = useState("");
  const [price, setPrice] = useState(0);
  const [priceLoading, setPriceLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const [depositing, setDepositing] = useState(false);
  const [addingLiquidity, setAddingLiquidity] = useState(false);

  const [deposited, setDeposited] = useState(false);
  const [addLiquiditySuccess, setAddLiquiditySuccess] = useState(false);
  const [fail, setFail] = useState(false);

  const [modalErrorText, setModalErrorText] = useState("");
  const [modalContentText, setModalContentText] = useState("");

  const pairContract = useMemo(() => {
    if (pool && pool.pairAddress && library) {
      return new UniV2Pair(pool.pairAddress, library.getSigner());
    }
  }, [library, pool]);

  const token0Contract = useMemo(() => {
    if (pair && pair[0].address !== WETH && library) return new ERC20(pair[0].address, library.getSigner());
  }, [library, pair]);

  const token1Contract = useMemo(() => {
    if (pair && pair[1].address !== WETH && library) return new ERC20(pair[1].address, library.getSigner());
  }, [library, pair]);

  const loadBalance = useCallback(async () => {
    if (!account || !pairContract || !library) return;
    setLoading(true);
    const ethBalance = (await library.getBalance(account)).toString();
    setLpBalance((await pairContract.balanceOf(account)).toString());

    if (token0Contract) {
      setToken0Decimal(pair[0].decimals);
      setToken0Balance((await token0Contract.balanceOf(account)).toString());
    } else {
      setToken0Decimal(18);
      setToken0Balance(ethBalance);
    }
    if (token1Contract) {
      setToken1Decimal(pair[1].decimals);
      setToken1Balance((await token1Contract.balanceOf(account)).toString());
    } else {
      setToken1Decimal(18);
      setToken1Balance(ethBalance);
    }
    setLoading(false);
  }, [account, library, pairContract, token0Contract, token1Contract, pair]);

  const loadReserve = useCallback(async () => {
    setPriceLoading(true);
    const reserves = await pairContract.getReserves();
    setPrice(
      fromWei(reserves[1].toString(), pair[1].decimals).dividedBy(fromWei(reserves[0].toString(), pair[0].decimals))
    );
    setPriceLoading(false);
  }, [pairContract, pair]);

  const initModal = () => {
    setLpAmount(0);
    setToken0Amount(0);
    setToken1Amount(0);
    setLpBalance(0);
    setToken0Balance(0);
    setToken1Balance(0);
    setToken0Decimal(0);
    setToken1Decimal(0);
    setErrorText0("");
    setErrorText1("");
    setErrorText2("");
    setPrice(0);
  };

  useEffect(() => {
    if (!visible) {
      initModal();
      return;
    }
    loadBalance();
    loadReserve();
  }, [loadBalance, loadReserve, visible]);

  const initSwalState = () => {
    setModalErrorText("");
    setModalContentText("");
    setDeposited(false);
    setAddLiquiditySuccess(false);
    setFail(false);
  };

  const onDeposit = async () => {
    try {
      const _lpAmount = toWei(lpAmount);
      if (_lpAmount.isGreaterThan(lpBalance)) {
        setErrorText2(t("error.big"));
        return;
      } else if (_lpAmount.isZero() || _lpAmount.isLessThan(0)) {
        setErrorText2(t("error.invalid"));
        return;
      }

      const contract = pool.contract[currentEpoch];

      if (!contract) throw new Error("Contract is not initiated");
      initSwalState();

      setDepositing(true);
      setSwalVisible(true);

      setModalContentText(`${t("approving")} ${lpSymbol}`);

      const lpAllowance = new BigNumber((await pairContract.allowance(account, contract.address)).toString());
      if (lpAllowance.isLessThan(_lpAmount)) {
        await (await pairContract.approve(contract.address, MAXUINT256)).wait();
      }

      setModalContentText(`${t("depositing")} ${lpSymbol}`);

      await (await contract.add_liquidity(_lpAmount.toFixed(0), 0)).wait();

      setDepositing(false);
      setDeposited(true);
      setModalContentText(printf(t("swal.deposit_succeed"), lpSymbol));
      initModal();
      loadBalance();
      loadReserve();
    } catch (err) {
      console.error(err);
      setDepositing(false);
      setDeposited(false);
      setFail(true);
      setModalErrorText(err.message);
    }
  };

  const addLiquidity = async () => {
    try {
      let _token0Amount, _token1Amount;
      if (token0Contract) {
        _token0Amount = toWei(token0Amount, token0Decimal);
      } else {
        _token0Amount = toWei(token0Amount);
      }
      if (token1Contract) {
        _token1Amount = toWei(token1Amount, token1Decimal);
      } else {
        _token1Amount = toWei(token1Amount);
      }

      if (_token0Amount.isGreaterThan(token0Balance)) {
        setErrorText0(t("error.big"));
        return;
      } else if (_token0Amount.isZero() || _token0Amount.isLessThan(0)) {
        setErrorText0(t("error.invalid"));
        return;
      }

      if (_token1Amount.isGreaterThan(token1Balance)) {
        setErrorText1(t("error.big"));
        return;
      } else if (_token1Amount.isZero() || _token1Amount.isLessThan(0)) {
        setErrorText1(t("error.invalid"));
        return;
      }

      const Router =
        pool.type === PoolType.UniPool ? new UniV2Router(library.getSigner()) : new SushiRouter(library.getSigner());

      if (!Router) throw new Error("Router is not initiated");
      initSwalState();

      setAddingLiquidity(true);
      setSwalVisible(true);

      if (token0Contract) {
        setModalContentText(`${t("approving")} ${pair[0].name}`);
        const token0Allowance = new BigNumber((await token0Contract.allowance(account, Router.address)).toString());
        if (token0Allowance.isLessThan(_token0Amount)) {
          await (await token0Contract.approve(Router.address, MAXUINT256)).wait();
        }
      }

      if (token1Contract) {
        setModalContentText(`${t("approving")} ${pair[1].name}`);
        const token1Allowance = new BigNumber((await token1Contract.allowance(account, Router.address)).toString());
        if (token1Allowance.isLessThan(_token1Amount)) {
          await (await token1Contract.approve(Router.address, MAXUINT256)).wait();
        }
      }

      setModalContentText(printf(t("swal.liquidity_adding"), swapName));
      let _token1AmountMin, _token0AmountMin;
      _token1AmountMin = new BigNumber(1 - slippage / 100).multipliedBy(_token1Amount);
      _token0AmountMin = new BigNumber(1 - slippage / 100).multipliedBy(_token0Amount);
      const currenTimestamp = Math.round(new Date() / 1000);
      if (pair[0].address === WETH) {
        await (
          await Router.addLiquidityETH(
            pair[1].address,
            _token1Amount.toFixed(0),
            _token1AmountMin.toFixed(0),
            _token0AmountMin.toFixed(0),
            account,
            currenTimestamp + deadline * 60,
            {
              value: _token0Amount.toFixed(0),
            }
          )
        ).wait();
      } else if (pair[1].address === WETH) {
        await (
          await Router.addLiquidityETH(
            pair[0].address,
            _token0Amount.toFixed(0),
            _token0AmountMin.toFixed(0),
            _token1AmountMin.toFixed(0),
            account,
            currenTimestamp + deadline * 60,
            {
              from: account,
              value: _token1Amount.toFixed(0),
            }
          )
        ).wait();
      } else {
        await (
          await Router.addLiquidity(
            pair[0].address,
            pair[1].address,
            _token0Amount.toFixed(0),
            _token1Amount.toFixed(0),
            _token0AmountMin.toFixed(0),
            _token1AmountMin.toFixed(0),
            account,
            currenTimestamp + deadline * 60
          )
        ).wait();
      }

      setAddingLiquidity(false);
      setAddLiquiditySuccess(true);
      setModalContentText(printf(t("swal.liquidity_added"), swapName));
      initModal();
      loadBalance();
      loadReserve();
    } catch (err) {
      console.error(err);
      setAddingLiquidity(false);
      setAddLiquiditySuccess(false);
      setFail(true);
      setModalErrorText(err.message);
    }
  };

  const onLpSliderChange = (value) => {
    setLpAmount(fromWei(lpBalance).dividedBy(100).multipliedBy(value).toFixed());
    setErrorText2("");
  };

  const onToken0SliderChange = (value) => {
    const _value = fromWei(token0Balance, token0Decimal).dividedBy(100).multipliedBy(value);
    setToken0Amount(_value.toFixed());
    setToken1Amount(new BigNumber(_value).multipliedBy(price).toFixed());
    setErrorText0("");
    setErrorText1("");
  };

  const onToken1SliderChange = (value) => {
    const _value = fromWei(token1Balance, token1Decimal).dividedBy(100).multipliedBy(value);
    setToken1Amount(_value.toFixed());
    setToken0Amount(new BigNumber(_value).dividedBy(price).toFixed());
    setErrorText0("");
    setErrorText1("");
  };

  return (
    <>
      <Modal
        visible={visible}
        width={800}
        centered
        maskClosable={false}
        title={[<IconGroupWrapper offset={-15} icons={icons} key="icon" />, <span key="title">{t("addliquidity")}</span>]}
        footer={[
          <Button key="cancel" onClick={() => showModal(false)} secondary bold>
            {t("cancel")}
          </Button>,
          <Button key="confirm" onClick={() => onDeposit()} bold>
            {t("deposit")}
          </Button>,
        ]}
        onOk={() => showModal(false)}
        onCancel={() => showModal(false)}
      >
        <FlexBox flexDirection="column" gap={20}>
          <Paper
            flexDirection="column"
            gap={10}
            title={
              <FlexBox justifyContent="space-between">
                <span>{printf(t("modal.add_liquidity_swap"), swapName, pool.name)}</span>
                {priceLoading ? (
                  <Skeleton width={200} />
                ) : (
                  <span>
                    1 {pair[0].name} = {`${new BigNumber(price).toFormat(6)} ${pair[1].name}`}
                  </span>
                )}
              </FlexBox>
            }
            footer={[
              <Button key="exchange" onClick={() => addLiquidity()} bold>
                {t("addliquidity")}
              </Button>,
            ]}
          >
            <Row gutter={[40, 10]}>
              <Col xl={6} md={24} xs={24}>
                <FlexBox flexDirection="column" gap={8}>
                  <Typography>{t("available")} {pair[0].name}</Typography>
                  {loading ? (
                    <Skeleton width={120} />
                  ) : (
                    <Typography size={24} weight={550} primary>
                      {fromWei(token0Balance, token0Decimal).toFormat(6)}
                    </Typography>
                  )}
                </FlexBox>
              </Col>
              <Col xl={9} md={24} xs={24}>
                <FlexBox flexDirection="column">
                  <Typography>{t("modal.available_amount")}</Typography>
                  <Slider onChange={onToken0SliderChange} />
                </FlexBox>
              </Col>
              <Col xl={9} md={24} xs={24}>
                <FlexBox flexDirection="column" gap={8}>
                  <Typography>{t("modal.deposit_amount")}</Typography>
                  <Input
                    addonAfter={pair[0].name}
                    type="number"
                    style={{ textAlign: "end" }}
                    placeholder="0.00"
                    error={errorText0}
                    value={token0Amount}
                    onChange={(e) => {
                      setErrorText0("");
                      setToken0Amount(e.target.value);
                      setToken1Amount(new BigNumber(e.target.value ?? 0).multipliedBy(price).toFixed());
                    }}
                  />
                </FlexBox>
              </Col>
            </Row>
            <Row gutter={[40, 10]}>
              <Col xl={6} md={24} xs={24}>
                <FlexBox flexDirection="column" gap={8}>
                  <Typography>{t("available")} {pair[1].name}</Typography>
                  {loading ? (
                    <Skeleton width={120} />
                  ) : (
                    <Typography size={24} weight={550} primary>
                      {fromWei(token1Balance, token1Decimal).toFormat(6)}
                    </Typography>
                  )}
                </FlexBox>
              </Col>
              <Col xl={9} md={24} xs={24}>
                <FlexBox flexDirection="column">
                  <Typography>{t("modal.available_amount")}</Typography>
                  <Slider onChange={onToken1SliderChange} />
                </FlexBox>
              </Col>
              <Col xl={9} md={24} xs={24}>
                <FlexBox flexDirection="column" gap={8}>
                  <Typography>{t("modal.deposit_amount")}</Typography>
                  <Input
                    addonAfter={pair[1].name}
                    type="number"
                    style={{ textAlign: "end" }}
                    placeholder="0.00"
                    value={token1Amount}
                    error={errorText1}
                    onChange={(e) => {
                      setErrorText1("");
                      setToken1Amount(e.target.value);
                      setToken0Amount(new BigNumber(e.target.value ?? 0).dividedBy(price).toFixed());
                    }}
                  />
                </FlexBox>
              </Col>
            </Row>
            <Row gutter={[40, 10]}>
              <Col xl={8} md={24} xs={24}>
                <FlexBox flexDirection="column" gap={8}>
                  <Typography>
                    {t("modal.select_slippage")} %
                    <PopInfo title={`${t("slippage")} %`} content={t("modal.slippage_description")} />
                  </Typography>
                  <Radio.Group onChange={(e) => setSlippage(e.target.value)} value={slippage}>
                    <Radio value={1}>1%</Radio>
                    <Radio value={5}>5%</Radio>
                    <Radio value={15}>15%</Radio>
                  </Radio.Group>
                </FlexBox>
              </Col>
              <Col xl={8} md={24} xs={24}>
                <FlexBox flexDirection="column" gap={8}>
                  <Typography>
                    {t("modal.slippage_tolerance")}
                    <PopInfo
                      title={t("modal.slippage_tolerance")}
                      content={t("modal.price_revert")}
                    />
                  </Typography>
                  <Input
                    addonAfter="%"
                    type="number"
                    value={slippage}
                    onChange={(e) => setSlippage(Math.min(parseFloat(e.target.value), 49.9))}
                    style={{ textAlign: "end" }}
                    placeholder="5"
                  />
                </FlexBox>
              </Col>
              <Col xl={8} md={24} xs={24}>
                <FlexBox flexDirection="column" gap={8}>
                  <Typography>
                    {t("modal.deadline")}
                    <PopInfo
                      title={t("modal.deadline")}
                      content={t("modal.time_revert")}
                    />
                  </Typography>
                  <Input
                    addonAfter="Mins"
                    type="number"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    style={{ textAlign: "end" }}
                    placeholder="20"
                  />
                </FlexBox>
              </Col>
            </Row>
          </Paper>

          <Paper flexDirection="column" gap={10} title={`${t("deposit")} ${pool.name}`}>
            <Row gutter={[40, 10]}>
              <Col xl={6} md={24} xs={24}>
                <FlexBox flexDirection="column" gap={8}>
                  <Typography>{t("available")} {lpSymbol}</Typography>
                  {loading ? (
                    <Skeleton width={120} />
                  ) : (
                    <Typography size={24} weight={550} primary>
                      {fromWei(lpBalance).toFormat(6)}
                    </Typography>
                  )}
                </FlexBox>
              </Col>
              <Col xl={9} md={24} xs={24}>
                <FlexBox flexDirection="column">
                  <Typography>{t("modal.available_amount")}</Typography>
                  <Slider onChange={onLpSliderChange} />
                </FlexBox>
              </Col>
              <Col xl={9} md={24} xs={24}>
                <FlexBox flexDirection="column" gap={8}>
                  <Typography>{t("modal.deposit_amount")}</Typography>
                  <Input
                    addonAfter={lpSymbol}
                    type="number"
                    style={{ textAlign: "end" }}
                    placeholder="0.00"
                    value={lpAmount}
                    error={errorText2}
                    onChange={(e) => {
                      setErrorText2("");
                      setLpAmount(e.target.value);
                    }}
                  />
                </FlexBox>
              </Col>
            </Row>
          </Paper>
          <Paper flexDirection="column" gap={10} title={t("modal.deposit_duration")}>
            <Typography>
              {t("modal.lockup_description")}
            </Typography>
            <Typography>{t("modal.remove_description")}</Typography>
            <Typography>
            {t("modal.redemption_date")}: <b>{toTimezoneFormat(epochEnd)}</b>
              <PopInfo
                title={t("modal.redemption_date")}
                content={t("modal.remove_description")}
              />
            </Typography>
          </Paper>
        </FlexBox>
      </Modal>

      <Modal visible={swalVisible} width={450} centered maskClosable={false} title={false} footer={false}>
        <FlexBox flexDirection="column" justifyContent="center" alignItems="center" style={{ padding: 16 }} gap={30}>
          {(depositing || addingLiquidity) && <Loader type="TailSpin" color="#aaa" height={80} width={80} />}
          {(deposited || addLiquiditySuccess) && <CheckMark />}
          {fail && <DenyMark />}
          {modalErrorText ? (
            <Typography size={20} align="center">
              {modalErrorText}
            </Typography>
          ) : (
            <Typography size={24} align="center">
              {modalContentText}
            </Typography>
          )}
          <Button key="cancel" onClick={() => setSwalVisible(false)}>
            {t("close")}
          </Button>
        </FlexBox>
      </Modal>
    </>
  );
};

export default DepositModal;
