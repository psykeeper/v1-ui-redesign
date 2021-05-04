import styled from "styled-components";
import { Table } from "antd";
const StyledTable = styled(Table)`
  .ant-table {
    background: transparent;
    color: inherit;
  }
  .ant-table-column-sorter-up.active,
  .ant-table-column-sorter-down.active {
    color: ${({ theme }) => theme.highlight};
  }
  thead {
    th {
      background: transparent;
      color: ${({ theme }) => theme.typo.secondary};
      border-bottom: none;
      font-weight: 600;
    }
  }
  .ant-table-tbody > tr.ant-table-row:hover > td {
    background: ${({ theme }) => theme.table.hover};
  }
  .ant-table-thead th.ant-table-column-sort {
    background: ${({ theme }) => theme.table.sortHover};
  }
  .ant-table-thead th.ant-table-column-has-sorters:hover {
    background: ${({ theme }) => theme.table.sortHover};
  }
  tbody {
    td.ant-table-column-sort {
      background: transparent;
    }
    tr {
      cursor: pointer;
      td {
        border-bottom: none;
        font-weight: 600;
      }
    }
    tr:nth-child(2n) {
      background: ${({ theme }) => theme.table.even};
    }
    tr:nth-child(2n + 1) {
      background: ${({ theme }) => theme.table.odd};
    }
    td.highlight {
      color: ${({ theme }) => theme.highlight};
    }
  }
`;

export const BasicTable = ({ width, columns, onRowClick, onMouseEnter, onMouseLeave, dataSource, ...rest }) => {
  return (
    <StyledTable
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      {...rest}
      showSorterTooltip={false}
      onRow={(record, rowIndex) => {
        return {
          onClick: (event) => {
            if (onRowClick) onRowClick(record, rowIndex, event);
          },
          onMouseEnter: (event) => {
            if (onMouseEnter) onMouseEnter(record, rowIndex, event);
          },
          onMouseLeave: (event) => {
            if (onMouseLeave) onMouseLeave(record, rowIndex, event);
          },
        };
      }}
    />
  );
};
