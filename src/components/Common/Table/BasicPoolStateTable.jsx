import Table from "rc-table";
import styled from "styled-components";

const StyledTable = styled(Table)`
  th,
  td {
    margin: 0;
    padding: 0.5rem;
  }
  th {
    color: ${({ theme }) => theme.typo.secondary};
  }
  td {
    color: ${({ theme }) => theme.typo.primary};
  }
`;

export const BasicPoolStateTable = ({ columns, data }) => {
  return <StyledTable columns={columns} data={data} />;
};
