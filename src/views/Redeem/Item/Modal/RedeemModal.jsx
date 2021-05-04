import { useState } from "react";
import { Paper, FlexBox } from "components/Common/Box";
import { Modal, Input, Slider } from "components/Common";
import { Typography } from "components/Common/Statistic";
import { Button } from "components/Common/Button";
import { Row, Col, Radio, Select, Space } from "antd";
import BigNumber from "bignumber.js";
import { toWei } from "lib/utils/helper";
import { SaffronLPToken } from "lib/contracts";
import { IconGroupWrapper } from "components/Common/Wrapper";
import Loader from "react-loader-spinner";
import { useSaffronContext } from "lib/context";
import { useWeb3React } from "@web3-react/core";
import { CheckMark, DenyMark } from "components/Common/Icon";
import { useTranslation } from "react-i18next";
import { printf } from "lib/utils/helper";

const RedeemModal = ({ pool, isOpened, showModal }) => {
  const { t } = useTranslation();
  const icons = pool.pair.map((token) => token.icon);
  const { redeemable_epoch, principal, sfi_redeemable, dsec_token, principal_token } = pool;
  const [epoch, setEpoch] = useState(redeemable_epoch[redeemable_epoch.length - 1] ?? 0);
  const { refresh } = useSaffronContext();
  const { account, library } = useWeb3React();
  const [sfiAmount, setSfiAmount] = useState(0);
  const [lpAmount, setLpAmount] = useState(0);
  const [redeemMode, setRedeemMode] = useState(0);

  const [errorText0, setErrorText0] = useState("");
  const [errorText1, setErrorText1] = useState("");
  const [swalVisible, setSwalVisible] = useState(false);

  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [modalErrorText, setModalErrorText] = useState("");
  const [modalContentText, setModalContentText] = useState("");

  const initModal = () => {
    setLpAmount(0);
    setSfiAmount(0);
    setErrorText0("");
    setErrorText1("");
  };

  const initSwalState = () => {
    setModalErrorText("");
    setModalContentText("");
    setFail(false);
    setSuccess(false);
  };

  const onRedeem = async () => {
    try {
      const _sfiAmount = toWei(sfiAmount);
      const _lpAmount = toWei(lpAmount);
      const _principalTotal = toWei(principal[epoch]);

      const _percentage = _sfiAmount.dividedBy(toWei(sfi_redeemable[epoch]));

      if (redeemMode === 0 || redeemMode === 2) {
        if (_lpAmount.isGreaterThan(_principalTotal)) {
          setErrorText0(t("error.big"));
          return;
        } else if (_lpAmount.isZero() || _lpAmount.isLessThan(0)) {
          setErrorText0(t("error.invalid"));
          return;
        }
      }
      if (redeemMode === 1 || redeemMode === 2) {
        if (_sfiAmount.isGreaterThan(toWei(sfi_redeemable[epoch]))) {
          setErrorText1(t("error.big"));
          return;
        } else if (_sfiAmount.isZero() || _sfiAmount.isLessThan(0)) {
          setErrorText1(t("error.invalid"));
          return;
        }
      }
      initSwalState();
      setRedeeming(true);
      setSwalVisible(true);

      if (redeemMode === 0) setModalContentText(t("swal.redeeming_principal"));
      else if (redeemMode === 1) setModalContentText(t("swal.redeeming_sfi"));
      else setModalContentText(t("swal.redeeming_principal_sfi"));

      const contract = pool.contract[epoch];
      if (!contract) throw new Error("Contract is not initiated");

      const contractDSec = new SaffronLPToken(dsec_token[epoch], library.getSigner());
      const dsec_amount = (await contractDSec.balanceOf(account)).toString();
      const _dsec_amount = _percentage.multipliedBy(dsec_amount);

      await (
        await contract.remove_liquidity(
          dsec_token[epoch],
          _dsec_amount.toFixed(0),
          principal_token[epoch],
          _lpAmount.toFixed(0)
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

  const onSFISliderChange = (value) => {
    setSfiAmount(new BigNumber(sfi_redeemable[epoch] ?? 0).dividedBy(100).multipliedBy(value).toFixed());
  };

  const onLpSliderChange = (value) => {
    setLpAmount(new BigNumber(principal[epoch] ?? 0).dividedBy(100).multipliedBy(value).toFixed());
  };

  const formatNumber = (value, decimal = 6) => new BigNumber(value ?? 0).toFormat(decimal);

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
            onClick={() => onRedeem()}
            bold
            disabled={
              ((redeemMode === 0 || redeemMode === 2) && new BigNumber(principal[epoch]).isZero()) ||
              ((redeemMode === 1 || redeemMode === 2) && new BigNumber(sfi_redeemable[epoch]).isZero())
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
              <Paper flexDirection="column" gap={10} title={t("modal.redemption_balance")}>
                <Row gutter={10}>
                  <Col xl={12} md={8} xs={24}>
                    <Typography>{t("modal.lp_principal")}:</Typography>
                    <Typography size={16} weight={550} primary>
                      {`${formatNumber(principal[epoch])} LP`}
                    </Typography>
                  </Col>
                  <Col xl={12} md={8} xs={24}>
                    <Typography>{t("modal.sfi_rewards")}:</Typography>
                    <Typography size={16} weight={550} primary>
                      {`${formatNumber(sfi_redeemable[epoch])} SFI`}
                    </Typography>
                  </Col>
                </Row>
              </Paper>
            </Col>
          </Row>

          <Paper flexDirection="column" gap={10} title={t("modal.redeem_principal_sfi")}>
            <Radio.Group onChange={(e) => setRedeemMode(e.target.value)} value={redeemMode}>
              <Radio value={0}>{t("modal.redeem_principal")}</Radio>
              <Radio value={1}>{t("modal.redeem_sfi")}</Radio>
              <Radio value={2}>{t("modal.redeem_both")}</Radio>
            </Radio.Group>
          </Paper>
          {(redeemMode === 0 || redeemMode === 2) && (
            <Paper flexDirection="column" gap={10} title={t("modal.redeem_principal")}>
              <Row gutter={[40, 20]}>
                <Col xl={6} md={24} xs={24}>
                  <FlexBox flexDirection="column" gap={8}>
                    <Typography>{printf(t("modal.held_in_pool"), "LP")}</Typography>
                    <Typography size={20} weight={550} primary>
                      {`${formatNumber(principal[epoch])} LP`}
                    </Typography>
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
                    <Typography>{t("modal.redemption_amount")}</Typography>
                    <Input
                      addonAfter="LP"
                      type="number"
                      style={{ textAlign: "end" }}
                      placeholder="0.0000"
                      value={lpAmount}
                      error={errorText0}
                      onChange={(e) => {
                        setErrorText0("");
                        setLpAmount(e.target.value);
                      }}
                    />
                  </FlexBox>
                </Col>
              </Row>
            </Paper>
          )}
          {(redeemMode === 1 || redeemMode === 2) && (
            <Paper flexDirection="column" gap={10} title={t("modal.redeem_sfi_rewards")}>
              <Row gutter={[40, 20]}>
                <Col xl={6} md={24} xs={24}>
                  <FlexBox flexDirection="column" gap={8}>
                    <Typography>{t("modal.sfi_earnings")}</Typography>
                    <Typography size={20} weight={550} primary>
                      {`${formatNumber(sfi_redeemable[epoch])} SFI`}
                    </Typography>
                  </FlexBox>
                </Col>
                <Col xl={9} md={24} xs={24}>
                  <FlexBox flexDirection="column">
                    <Typography>{t("redemption")} %</Typography>
                    <Slider onChange={onSFISliderChange} />
                  </FlexBox>
                </Col>
                <Col xl={9} md={24} xs={24}>
                  <FlexBox flexDirection="column">
                    <Space size={5} direction="vertical">
                      <Typography>{t("modal.redemption_amount")}</Typography>
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

export default RedeemModal;
