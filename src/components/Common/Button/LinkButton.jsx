import Button from "./Button";
import { useHistory } from "react-router-dom";

const LinkButton = ({ to, children, ...rest }) => {
  const history = useHistory();
  const navigate = () => history.push(to);
  return (
    <Button {...rest} onClick={navigate}>
      {children}
    </Button>
  );
};

export default LinkButton;
