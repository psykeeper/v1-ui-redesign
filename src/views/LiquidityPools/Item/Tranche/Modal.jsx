import { IconGroupWrapper } from "components/Common/Wrapper";
import { Paper, FlexBox } from "components/Common/Box";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Modal, Input, PopInfo, Slider } from "components/Common";
import { Typography } from "components/Common/Statistic";
import { ERC20, SFIToken } from "lib/contracts";
import { Button } from "components/Common/Button";
import { Row, Col, Radio } from "antd";
import { toTimezoneFormat, fromWei, toWei } from "lib/utils/helper";
import BigNumber from "bignumber.js";
import { MAXUINT256 } from "lib/config/constant";
import { Tranche } from "lib/config/constant";
import { useWeb3React } from "@web3-react/core";
import Loader from "react-loader-spinner";
import { useSaffronContext } from "lib/context";
import { CheckMark, DenyMark } from "components/Common/Icon";
import Skeleton from "components/Common/Skeleton";
import { useTranslation } from "react-i18next";
import { printf } from "lib/utils/helper";

const DepositModal = ({ visible, showModal, pool }) => {
  const { t } = useTranslation();
  const [tranche, setTranche] = useState(0);
  const { currentEpoch, epochEnd } = useSaffronContext();
  const { account, library } = useWeb3React();
  const [token0Amount, setToken0Amount] = useState(0);
  const [sfiAmount, setSfiAmount] = useState(0);

  const [token0Decimal, setToken0Decimal] = useState(0);
  const [token0Balance, setToken0Balance] = useState(0);
  const [sfiBalance, setSfiBalance] = useState(0);

  const [swalVisible, setSwalVisible] = useState(false);
  const [errorText0, setErrorText0] = useState("");
  const [errorText1, setErrorText1] = useState("");

  const [depositing, setDepositing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);

  const [modalErrorText, setModalErrorText] = useState("");
  const [modalContentText, setModalContentText] = useState("");
  const [loading, setLoading] = useState(false);

  const icons = pool.pair.map((token) => token.icon);

  const baseContract = useMemo(() => {
    if (pool && pool.pair[0].address && library) return new ERC20(pool.pair[0].address, library.getSigner());
  }, [pool, library]);

  const sfiToken = useMemo(() => {
    if (library) return new SFIToken(library.getSigner());
  }, [library]);

  const loadBalance = useCallback(async () => {
    if (!account || !baseContract || !library) return;
    setLoading(true);
    setToken0Decimal(pool.pair[0].decimals);
    setToken0Balance((await baseContract.balanceOf(account)).toString());
    setSfiBalance((await sfiToken.balanceOf(account)).toString());
    setLoading(false);
  }, [account, baseContract, library, sfiToken, pool]);

  useEffect(() => {
    if (!visible) {
      initModal();
      return;
    }
    loadBalance();
  }, [loadBalance, visible]);

  const initModal = () => {
    setSfiAmount(0);
    setSfiBalance(0);
    setToken0Balance(0);
    setToken0Amount(0);
    setToken0Decimal(0);
    setErrorText0("");
    setErrorText1("");
  };

  const initSwalState = () => {
    setModalErrorText("");
    setModalContentText("");
    setSuccess(false);
    setFail(false);
  };

  const onDeposit = async () => {
    try {
      const _sfiAmount = toWei(sfiAmount);
      const _token0Amount = toWei(token0Amount, token0Decimal);

      if (_token0Amount.isGreaterThan(token0Balance)) {
        setErrorText0(t("error.big"));
        return;
      } else if (_token0Amount.isZero() || _token0Amount.isLessThan(0)) {
        setErrorText0(t("error.invalid"));
        return;
      }

      if (tranche === Tranche.A) {
        if (_sfiAmount.isGreaterThan(sfiBalance)) {
          setErrorText1(t("error.big"));
          return;
        } else if (_sfiAmount.isZero() || _sfiAmount.isLessThan(0)) {
          setErrorText1(t("error.invalid"));
          return;
        }
      }

      const contract = pool.contract[currentEpoch];

      if (!contract) throw new Error("Contract is not initiated");
      initSwalState();

      setDepositing(true);
      setSwalVisible(true);

      setModalContentText(`${t("approving")} ${pool.pair[0].name} Token`);
      const token0Allowance = new BigNumber((await baseContract.allowance(account, contract.address)).toString());
      if (token0Allowance.isLessThan(_token0Amount)) {
        await (await baseContract.approve(contract.address, MAXUINT256)).wait();
      }

      if (tranche === Tranche.A) {
        setModalContentText(`${t("approving")}} SFI`);

        const sfiAllowance = new BigNumber((await sfiToken.allowance(account, contract.address)).toString());
        if (sfiAllowance.isLessThan(_sfiAmount)) {
          await (await sfiToken.approve(contract.address, MAXUINT256)).wait();
        }
      }
      setModalContentText(`${t("depositing")}} ${pool.pair[0].name}${tranche === Tranche.A ? "/SFI" : ""}`);
      if (tranche === Tranche.A) {
        await (
          await contract.add_liquidity(_token0Amount.dividedBy(pool.trancheAMultiplier).toFixed(0), tranche)
        ).wait();
      } else {
        await (await contract.add_liquidity(_token0Amount.toFixed(0), tranche)).wait();
      }

      setDepositing(false);
      setSuccess(true);
      initModal();
      loadBalance();
    } catch (err) {
      console.error(err);
      setDepositing(false);
      setFail(true);
      setModalErrorText(err.message);
    }
  };

  const onSliderChange = (value) => {
    const _value = fromWei(token0Balance, token0Decimal).dividedBy(100).multipliedBy(value);
    setToken0Amount(_value.toFixed());
    setSfiAmount(new BigNumber(_value).dividedBy(pool.sfi_ratio).toFixed());
    setErrorText0("");
  };

  const onSfiSliderChange = (value) => {
    const _value = fromWei(sfiBalance).dividedBy(100).multipliedBy(value);
    setSfiAmount(_value.toFixed());
    setToken0Amount(new BigNumber(_value).multipliedBy(pool.sfi_ratio).toFixed());
    setErrorText1("");
  };

  return (
    <>
      <Modal
        visible={visible}
        width={800}
        centered
        maskClosable={false}
        title={[
          <IconGroupWrapper offset={-15} icons={icons} key="icon" />,
          <span key="title">{t("addliquidity")}</span>,
        ]}
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
          <Paper flexDirection="column" gap={10} title={t("modal.select_tranche")}>
            <Radio.Group name="trancheGroup" defaultValue={tranche} onChange={(e) => setTranche(e.target.value)}>
              <Row gutter={10}>
                <Col xl={8} md={8} xs={24}>
                  <Radio value={0} id="stranche">
                    S {t("tranche")}
                    <p>{t("modal.s_tranche_description")}</p>
                    <div>
                      {t("modal.sfi_earnings")}: <b>90%</b>
                    </div>
                    <div>
                      {t("apy")}:{" "}
                      <b>
                        {pool.apy
                          ? `${new BigNumber(pool.apy[Tranche.S]).dividedBy(10).toFormat(2)}% - ${new BigNumber(
                              pool.apy[Tranche.S]
                            ).toFormat(2)}%`
                          : "0.00%"}
                      </b>
                    </div>
                  </Radio>
                </Col>
                <Col xl={8} md={8} xs={24}>
                  <Radio value={1} disabled>
                    AA {t("tranche")}
                    <p>{t("modal.aa_tranche_description")}</p>
                    <div>
                      {t("modal.sfi_earnings")}: <b>0%</b>
                    </div>
                    <div>
                      {t("apy")}: <b>0.00%</b>
                    </div>
                  </Radio>
                </Col>
                <Col xl={8} md={8} xs={24}>
                  <Radio value={2}>
                    A {t("tranche")}
                    <p>{t("modal.a_tranche_description")}</p>
                    <div>
                      {t("modal.sfi_earnings")}: <b>10%</b>
                    </div>
                    <div>
                      {t("apy")}: <b>{pool.apy ? `${new BigNumber(pool.apy[Tranche.A]).toFormat(2)}%` : "0.00%"}</b>
                    </div>
                  </Radio>
                </Col>
              </Row>
            </Radio.Group>
          </Paper>

          <Paper flexDirection="column" gap={10} title={t("modal.select_amount")}>
            <Row gutter={[40, 10]}>
              <Col xl={6} md={24} xs={24}>
                <FlexBox flexDirection="column" gap={8}>
                  <Typography>
                    {t("available")} {pool.pair[0].name}
                  </Typography>
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
                  <Slider onChange={onSliderChange} />
                </FlexBox>
              </Col>
              <Col xl={9} md={24} xs={24}>
                <FlexBox flexDirection="column" gap={8}>
                  <Typography>{t("modal.deposit_amount")}</Typography>
                  <Input
                    addonAfter={pool.pair[0].name}
                    type="number"
                    style={{ textAlign: "end" }}
                    placeholder="0.0000"
                    value={token0Amount}
                    error={errorText0}
                    onChange={(e) => {
                      setErrorText0("");
                      setToken0Amount(e.target.value);
                      setSfiAmount(new BigNumber(e.target.value ?? 0).dividedBy(pool.sfi_ratio).toFixed());
                    }}
                  />
                </FlexBox>
              </Col>
            </Row>
            {tranche === Tranche.A && (
              <Row gutter={[40, 10]}>
                <Col xl={6} md={24} xs={24}>
                  <FlexBox flexDirection="column" gap={8}>
                    <Typography>{t("available")} SFI</Typography>
                    {loading ? (
                      <Skeleton width={120} />
                    ) : (
                      <Typography size={24} weight={550} primary>
                        {fromWei(sfiBalance).toFormat(6)}
                      </Typography>
                    )}
                  </FlexBox>
                </Col>
                <Col xl={9} md={24} xs={24}>
                  <FlexBox flexDirection="column">
                    <Typography>{t("modal.available_amount")}</Typography>
                    <Slider onChange={onSfiSliderChange} />
                  </FlexBox>
                </Col>
                <Col xl={9} md={24} xs={24}>
                  <FlexBox flexDirection="column" gap={8}>
                    <Typography>{t("modal.deposit_amount")}</Typography>
                    <Input
                      addonAfter="SFI"
                      type="number"
                      style={{ textAlign: "end" }}
                      placeholder="0.0000"
                      value={sfiAmount}
                      error={errorText1}
                      onChange={(e) => {
                        setErrorText1("");
                        setSfiAmount(e.target.value);
                        setToken0Amount(new BigNumber(e.target.value ?? 0).multipliedBy(pool.sfi_ratio).toFixed());
                      }}
                    />
                  </FlexBox>
                </Col>
              </Row>
            )}
          </Paper>
          <Paper flexDirection="column" gap={10} title={t("modal.deposit_duration")}>
            <Typography>{t("modal.lockup_description")}</Typography>
            <Typography>{t("modal.remove_description")}</Typography>
            <Typography>
              {t("modal.redemption_date")}: <b>{toTimezoneFormat(epochEnd)}</b>
              <PopInfo title={t("modal.redemption_date")} content={t("modal.remove_description")} />
            </Typography>
          </Paper>
        </FlexBox>
      </Modal>
      <Modal visible={swalVisible} width={450} centered maskClosable={false} title={false} footer={false}>
        <FlexBox flexDirection="column" justifyContent="center" alignItems="center" style={{ padding: 16 }} gap={30}>
          {depositing && <Loader type="TailSpin" color="#aaa" height={80} width={80} />}
          {success && <CheckMark />}
          {fail && <DenyMark />}
          {success && (
            <Typography size={24}>
              {printf(t("swal.deposit_succeed"), pool.pair[0].name + (tranche === Tranche.A ? "/SFI" : ""))}
            </Typography>
          )}
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
