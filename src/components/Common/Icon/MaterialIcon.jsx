import styled from "styled-components";
const StyledIcon = styled.i`
  font-size: ${({ size }) => (size ? `${size}px` : "18px")};
`;

const MaterialIcon = ({ icon, ...rest }) => {
  return (
    <StyledIcon className="material-icons" {...rest}>
      {icon}
    </StyledIcon>
  );
};

export default MaterialIcon;
