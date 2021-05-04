import { useState, useEffect } from "react";
import { Paper, FlexBox } from "components/Common/Box";
import { Modal, Input, Slider } from "components/Common";
import { Typography } from "components/Common/Statistic";
import { Button } from "components/Common/Button";
import { SaffronLPToken } from "lib/contracts";
import { Row, Col, Radio, Select, Space } from "antd";
import { IconGroupWrapper } from "components/Common/Wrapper";
import { Tranche } from "lib/config/constant";
import { toWei } from "lib/utils/helper";
import BigNumber from "bignumber.js";
import Loader from "react-loader-spinner";
import { useWeb3React } from "@web3-react/core";
import { useSaffronContext } from "lib/context";
import { CheckMark, DenyMark } from "components/Common/Icon";
import { useTranslation } from "react-i18next";
import { printf } from "lib/utils/helper";

const TrancheModal = ({ pool, isOpened, showModal }) => {
  const { t } = useTranslation();
  const icons = pool.pair.map((token) => token.icon);
  const { pair, redeemable_epoch, principal, interest_redeemable, sfi_redeemable, dsec_token, principal_token } = pool;
  const [tranche, setTranche] = useState(0);
  const { account, library } = useWeb3React();
  const { refresh } = useSaffronContext();
  const [epoch, setEpoch] = useState(redeemable_epoch[redeemable_epoch.length - 1] ?? 0);
  const [redeemMode, setRedeemMode] = useState(0);
  const [principalAmount, setPrincipalAmount] = useState(0);
  const [interestAmount, setInterestAmount] = useState(0);
  const [sfiAmount, setSfiAmount] = useState(0);
  const [errorText0, setErrorText0] = useState("");
  const [errorText1, setErrorText1] = useState("");
  const [errorText2, setErrorText2] = useState("");
  const [swalVisible, setSwalVisible] = useState(false);

  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [modalErrorText, setModalErrorText] = useState("");
  const [modalContentText, setModalContentText] = useState("");

  const onPrincipalSliderChange = (value) => {
    setPrincipalAmount(new BigNumber(principal[epoch][tranche] ?? 0).dividedBy(100).multipliedBy(value).toFixed(6));
  };

  const onInterestSliderChange = (value) => {
    setInterestAmount(
      new BigNumber(interest_redeemable[epoch][tranche] ?? 0).dividedBy(100).multipliedBy(value).toFixed()
    );
    setSfiAmount(new BigNumber(sfi_redeemable[epoch][tranche] ?? 0).dividedBy(100).multipliedBy(value).toFixed());
  };

  const formatNumber = (value, decimal = 6) => new BigNumber(value ?? 0).toFormat(decimal);

  const initModal = () => {
    setPrincipalAmount(0);
    setInterestAmount(0);
    setSfiAmount(0);
    setErrorText0("");
    setErrorText1("");
    setErrorText2("");
  };

  const initSwalState = () => {
    setModalErrorText("");
    setModalContentText("");
    setFail(false);
    setSuccess(false);
  };

  useEffect(() => {
    if (!isOpened) {
      initModal();
      return;
    }
  }, [isOpened]);

  const onRedeemChange = (value) => {
    setRedeemMode(value);
    setInterestAmount(0);
    setSfiAmount(0);
    setPrincipalAmount(0);
  };

  const onRedeem = async () => {
    try {
      const contract = pool.contract[epoch];
      if (!contract) throw new Error("Contract is not initiated");
      const base_decimal = await contract.getBaseDecimal();
      const _interestAmount = toWei(interestAmount, base_decimal);
      const _sfiAmount = toWei(sfiAmount);
      const _principalAmount = toWei(principalAmount);
      const _principalTotal = toWei(principal[epoch][tranche]);
      const _percentage = _interestAmount.dividedBy(toWei(interest_redeemable[epoch][tranche], base_decimal));
      if (redeemMode === 0 || redeemMode === 2) {
        if (_principalAmount.isGreaterThan(_principalTotal)) {
          setErrorText0(t("error.big"));
          return;
        } else if (_principalAmount.isZero() || _principalAmount.isLessThan(0)) {
          setErrorText0(t("error.invalid"));
          return;
        }
      }
      if (redeemMode === 1 || redeemMode === 2) {
        if (_interestAmount.isGreaterThan(toWei(interest_redeemable[epoch][tranche], base_decimal))) {
          setErrorText1(t("error.big"));
          return;
        } else if (_interestAmount.isZero() || _interestAmount.isLessThan(0)) {
          setErrorText1(t("error.invalid"));
          return;
        }
        if (_sfiAmount.isGreaterThan(toWei(sfi_redeemable[epoch][tranche]))) {
          setErrorText2(t("error.big"));
          return;
        } else if (_sfiAmount.isZero() || _sfiAmount.isLessThan(0)) {
          setErrorText2(t("error.invalid"));
          return;
        }
      }
      initSwalState();
      setRedeeming(true);
      setSwalVisible(true);

      if (redeemMode === 0) setModalContentText(t("swal.redeeming_principal"));
      else if (redeemMode === 1) setModalContentText(t("swal.redeeming_interest_sfi"));
      else setModalContentText(t("swal.redeeming_principal_interest_sfi"));

      const contractDSec = new SaffronLPToken(dsec_token[epoch][tranche], library.getSigner());
      const dsec_amount = (await contractDSec.balanceOf(account)).toString();
      const _dsec_amount = _percentage.multipliedBy(dsec_amount);

      await (
        await contract.remove_liquidity(
          dsec_token[epoch][tranche],
          _dsec_amount.toFixed(0),
          principal_token[epoch][tranche],
          _principalAmount.toFixed(0)
        )
      ).wait();

      setRedeeming(false);
      setSuccess(true);
      initModal();
      refresh();
    } catch (error) {
      console.error(error);
      setRedeeming(false);
      setFail(true);
      setModalErrorText(error.message);
    }
  };
  return (
    <>
      <Modal
        visible={isOpened}
        width={800}
        centered
        maskClosable={false}
        title={[
          <IconGroupWrapper offset={-10} icons={icons} key="icon" />,
          <span key="title">{t("redeem")} {pool.name}</span>,
        ]}
        footer={[
          <Button key="cancel" onClick={() => showModal(false)} bold secondary>
            {t("cancel")}
          </Button>,
          <Button
            key="confirm"
            bold
            onClick={() => onRedeem()}
            disabled={
              ((redeemMode === 0 || redeemMode === 2) && new BigNumber(principal[epoch][tranche]).isZero()) ||
              ((redeemMode === 1 || redeemMode === 2) &&
                (new BigNumber(interest_redeemable[epoch][tranche]).isZero() ||
                  new BigNumber(sfi_redeemable[epoch][tranche]).isZero()))
            }
          >
            {t("redeem")}
          </Button>,
        ]}
        onOk={() => showModal(false)}
        onCancel={() => showModal(false)}
      >
        <FlexBox flexDirection="column" gap={20}>
          <Row gutter={[20, 10]}>
            <Col xl={6} md={24} xs={24}>
              <Paper flexDirection="column" title={t("modal.select_epoch")}>
                <Select value={epoch} style={{ width: 120 }} onChange={(value) => setEpoch(value)}>
                  {redeemable_epoch &&
                    redeemable_epoch.map((epoch) => (
                      <Select.Option value={epoch} key={epoch}>
                        {t("epoch")} {epoch}
                      </Select.Option>
                    ))}
                </Select>
              </Paper>
            </Col>
            <Col xl={18} md={24} xs={24}>
              <Paper flexDirection="column" gap={10} title={t("modal.select_tranche")}>
                <Radio.Group name="trancheGroup" defaultValue={tranche} onChange={(e) => setTranche(e.target.value)}>
                  <Row gutter={10}>
                    <Col xl={8} md={8} xs={24}>
                      <Radio value={0} id="stranche" disabled={principal[epoch][Tranche.S] === undefined}>
                        S {t("tranche")}
                        <div>
                          {t("principal")}: <b>{`${formatNumber(principal[epoch][Tranche.S])} ${pair[0].name}`}</b>
                        </div>
                        <div>
                          {t("interest")}: <b>{`${formatNumber(interest_redeemable[epoch][Tranche.S])} ${pair[0].name}`}</b>
                        </div>
                        <div>
                          SFI: <b>{`${formatNumber(sfi_redeemable[epoch][Tranche.S])} SFI`}</b>
                        </div>
                      </Radio>
                    </Col>
                    <Col xl={8} md={8} xs={24}>
                      <Radio value={1} disabled={principal[epoch][Tranche.AA] === undefined}>
                        AA {t("tranche")}
                        <div>
                          {t("principal")}: <b>0.000000 {pair[0].name}</b>
                        </div>
                        <div>
                          {t("interest")}: <b>0.000000 {pair[0].name}</b>
                        </div>
                        <div>
                          SFI: <b>0.000000 SFI</b>
                        </div>
                      </Radio>
                    </Col>
                    <Col xl={8} md={8} xs={24}>
                      <Radio value={2} disabled={principal[epoch][Tranche.A] === undefined}>
                        A {t("tranche")}
                        <div>
                          {t("principal")}: <b>{`${formatNumber(principal[epoch][Tranche.A])} ${pair[0].name}`}</b>
                        </div>
                        <div>
                          {t("interest")}: <b>{`${formatNumber(interest_redeemable[epoch][Tranche.A])} ${pair[0].name}`}</b>
                        </div>
                        <div>
                          SFI: <b>{`${formatNumber(sfi_redeemable[epoch][Tranche.A])} SFI`}</b>
                        </div>
                      </Radio>
                    </Col>
                  </Row>
                </Radio.Group>
              </Paper>
            </Col>
          </Row>

          <Paper flexDirection="column" gap={10} title={t("modal.redeem_principal_interest_sfi")}>
            <Radio.Group onChange={(e) => onRedeemChange(e.target.value)} value={redeemMode}>
              <Radio value={0}>{t("modal.redeem_principal")}</Radio>
              <Radio value={1}>{t("modal.redeem_interest_sfi")}</Radio>
              <Radio value={2}>{t("modal.redeem_both")}</Radio>
            </Radio.Group>
          </Paper>
          {(redeemMode === 0 || redeemMode === 2) && (
            <Paper flexDirection="column" gap={10} title={t("modal.redeem_principal")}>
              <Row gutter={[40, 20]}>
                <Col xl={6} md={24} xs={24}>
                  <FlexBox flexDirection="column" gap={8}>
                    <Typography>{printf(t("modal.held_in_pool"), pair[0].name)}</Typography>
                    <Typography size={20} weight={500} primary>
                      {`${formatNumber(principal[epoch][tranche])} ${pair[0].name}`}
                    </Typography>
                  </FlexBox>
                </Col>
                <Col xl={9} md={24} xs={24}>
                  <FlexBox flexDirection="column">
                    <Typography>{t("modal.available_amount")}</Typography>
                    <Slider onChange={onPrincipalSliderChange} />
                  </FlexBox>
                </Col>
                <Col xl={9} md={24} xs={24}>
                  <FlexBox flexDirection="column" gap={8}>
                    <Typography>{t("modal.redemption_amount")}</Typography>
                    <Input
                      addonAfter={pair[0].name}
                      type="number"
                      style={{ textAlign: "end" }}
                      placeholder="0.0000"
                      value={principalAmount}
                      error={errorText0}
                      onChange={(e) => {
                        setErrorText0("");
                        setPrincipalAmount(e.target.value);
                      }}
                    />
                  </FlexBox>
                </Col>
              </Row>
            </Paper>
          )}
          {(redeemMode === 1 || redeemMode === 2) && (
            <Paper flexDirection="column" gap={10} title={t("modal.redeem_interest_sfi_rewards")}>
              <Row gutter={[40, 20]}>
                <Col xl={6} md={24} xs={24}>
                  <FlexBox flexDirection="column" gap={8}>
                    <Typography>{t("modal.interest_sfi_earnings")}</Typography>
                    <Typography size={20} weight={500} primary>
                      {`${formatNumber(interest_redeemable[epoch][tranche])} ${pair[0].name}`}
                    </Typography>
                    <Typography size={20} weight={500} primary>
                      {`${formatNumber(sfi_redeemable[epoch][tranche])} SFI`}
                    </Typography>
                  </FlexBox>
                </Col>
                <Col xl={9} md={24} xs={24}>
                  <FlexBox flexDirection="column">
                    <Typography>{t("redemption")} %</Typography>
                    <Slider onChange={onInterestSliderChange} />
                  </FlexBox>
                </Col>
                <Col xl={9} md={24} xs={24}>
                  <FlexBox flexDirection="column">
                    <Space size={5} direction="vertical">
                      <Typography>{t("modal.redemption_amount")}</Typography>
                      <Input
                        addonAfter={pair[0].name}
                        type="number"
                        style={{ textAlign: "end" }}
                        placeholder="0.0000"
                        error={errorText1}
                        value={interestAmount}
                        onChange={(e) => {
                          setErrorText1("");
                          setInterestAmount(e.target.value);
                          setSfiAmount(
                            new BigNumber(interest_redeemable[epoch][tranche]).isZero()
                              ? 0
                              : new BigNumber(e.target.value)
                                  .dividedBy(interest_redeemable[epoch][tranche] ?? 0)
                                  .multipliedBy(sfi_redeemable[epoch][tranche] ?? 0)
                                  .toFixed()
                          );
                        }}
                      />
                      <Input
                        addonAfter="SFI"
                        type="number"
                        style={{ textAlign: "end" }}
                        placeholder="0.0000"
                        error={errorText2}
                        value={sfiAmount}
                        onChange={(e) => {
                          setErrorText2("");
                          setSfiAmount(e.target.value);
                          setInterestAmount(
                            new BigNumber(sfi_redeemable[epoch][tranche]).isZero()
                              ? 0
                              : new BigNumber(e.target.value)
                                  .dividedBy(sfi_redeemable[epoch][tranche] ?? 0)
                                  .multipliedBy(interest_redeemable[epoch][tranche] ?? 0)
                                  .toFixed()
                          );
                        }}
                      />
                    </Space>
                  </FlexBox>
                </Col>
              </Row>
            </Paper>
          )}
        </FlexBox>
      </Modal>

      <Modal visible={swalVisible} width={450} centered maskClosable={false} title={false} footer={false}>
        <FlexBox flexDirection="column" justifyContent="center" alignItems="center" style={{ padding: 16 }} gap={30}>
          {redeeming && (
            <>
              <Loader type="TailSpin" color="#aaa" height={80} width={80} />
              <Typography size={24} align="center">
                {modalContentText}
              </Typography>
            </>
          )}
          {success && (
            <>
              <CheckMark />
              <Typography size={24}>{t("swal.redeem_succeed")}</Typography>
            </>
          )}
          {fail && (
            <>
              <DenyMark />
              <Typography size={20} align="center">
                {modalErrorText}
              </Typography>
            </>
          )}
          <Button key="cancel" onClick={() => setSwalVisible(false)}>
            {t("close")}
          </Button>
        </FlexBox>
      </Modal>
    </>
  );
};

export default TrancheModal;
