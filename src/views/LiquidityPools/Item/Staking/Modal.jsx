import { IconGroupWrapper } from "components/Common/Wrapper";
import { Paper, FlexBox } from "components/Common/Box";
import { Modal, Input, PopInfo, Slider } from "components/Common";
import { Typography } from "components/Common/Statistic";
import { Button } from "components/Common/Button";
import { Row, Col } from "antd";
import { toTimezoneFormat, fromWei, toWei } from "lib/utils/helper";
import { useWeb3React } from "@web3-react/core";
import { useState, useEffect, useMemo, useCallback } from "react";
import { SFIToken } from "lib/contracts";
import BigNumber from "bignumber.js";
import { useSaffronContext } from "lib/context";
import { MAXUINT256 } from "lib/config/constant";
import Loader from "react-loader-spinner";
import { CheckMark, DenyMark } from "components/Common/Icon";
import Skeleton from "components/Common/Skeleton";
import { useTranslation } from "react-i18next";
import { printf } from "lib/utils/helper";

const DepositModal = ({ visible, showModal, pool }) => {
  const { t } = useTranslation();
  const { currentEpoch, epochEnd } = useSaffronContext();
  const icons = pool.pair.map((token) => token.icon);
  const { account, library } = useWeb3React();

  const [swalVisible, setSwalVisible] = useState(false);
  const [amount, setAmount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [validationText, setValidationText] = useState("");
  const [approving, setApproving] = useState(false);
  const [depositing, setDepositing] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [loading, setLoading] = useState(false);

  const sfiToken = useMemo(() => {
    if (library) return new SFIToken(library.getSigner());
  }, [library]);

  const loadBalance = useCallback(async () => {
    if (!account || !sfiToken || !library) return;
    setLoading(true);
    setBalance((await sfiToken.balanceOf(account)).toString());
    setLoading(false);
  }, [account, sfiToken, library]);

  useEffect(() => {
    if (!visible) {
      initModal();
      return;
    }
    loadBalance();
  }, [loadBalance, visible]);

  const initModal = () => {
    setValidationText("");
    setBalance(0);
    setAmount(0);
  };

  const initSwalState = () => {
    setErrorText("");
    setSuccess(false);
    setFail(false);
  };

  const onDeposit = async () => {
    try {
      const _amount = toWei(amount);
      if (_amount.isGreaterThan(balance)) {
        setValidationText(t("error.big"));
        return;
      } else if (_amount.isZero() || _amount.isLessThan(0)) {
        setValidationText(t("error.invalid"));
        return;
      }
      const contract = pool.contract[currentEpoch];
      if (!contract) throw new Error("Contract is not initiated");
      initSwalState();
      setApproving(true);
      setSwalVisible(true);
      const allowance = new BigNumber((await sfiToken.allowance(account, contract.address)).toString());
      if (allowance.isLessThan(_amount)) {
        const res = await sfiToken.approve(contract.address, MAXUINT256);
        await res.wait();
      }
      setApproving(false);
      setDepositing(true);
      const res = await contract.add_liquidity(_amount.toFixed(0), 0);
      await res.wait();
      setDepositing(false);
      setSuccess(true);
      initModal();
      loadBalance();
    } catch (err) {
      console.error(err);
      setApproving(false);
      setDepositing(false);
      setFail(true);
      setErrorText(err.message);
    }
  };
  const onSliderChange = (value) => {
    setAmount(fromWei(balance).dividedBy(100).multipliedBy(value).toFixed());
    setValidationText("");
  };
  return (
    <>
      <Modal
        visible={visible}
        width={800}
        centered
        maskClosable={false}
        title={[<IconGroupWrapper offset={0} icons={icons} key="icon" />, <span key="title">{t("addliquidity")}</span>]}
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
          <Paper flexDirection="column" gap={10} title={`${t("deposit")} ${pool.pair[0].name}`}>
            <Row gutter={[40, 20]}>
              <Col xl={6} md={24} xs={24}>
                <FlexBox flexDirection="column" gap={8}>
                  <Typography>
                    {t("available")} {pool.pair[0].name}
                  </Typography>
                  {loading ? (
                    <Skeleton width={120} />
                  ) : (
                    <Typography size={24} weight={550} primary>
                      {fromWei(balance).toFormat(6)}
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
                    placeholder="0.0000"
                    value={amount}
                    onChange={(e) => {
                      setValidationText("");
                      setAmount(e.target.value);
                    }}
                    error={validationText}
                  />
                </FlexBox>
              </Col>
            </Row>
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
        <Modal visible={swalVisible} width={450} centered maskClosable={false} title={false} footer={false}>
          <FlexBox flexDirection="column" justifyContent="center" alignItems="center" style={{ padding: 16 }} gap={30}>
            {(approving || depositing) && <Loader type="TailSpin" color="#aaa" height={80} width={80} />}
            {success && <CheckMark />}
            {fail && <DenyMark />}
            {approving && <Typography size={24}>{`${t("approving")} ${pool.pair[0].name}`}</Typography>}
            {depositing && <Typography size={24}>{`${t("depositing")}} ${pool.pair[0].name}`}</Typography>}
            {success && <Typography size={24}>{printf(t("swal.deposit_succeed"), pool.pair[0].name)}</Typography>}
            {errorText && (
              <Typography size={20} align="center">
                {errorText}
              </Typography>
            )}
            <Button key="cancel" onClick={() => setSwalVisible(false)}>
              {t("close")}
            </Button>
          </FlexBox>
        </Modal>
      </Modal>
    </>
  );
};

export default DepositModal;
