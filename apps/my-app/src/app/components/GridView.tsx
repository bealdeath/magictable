
import React, { useState } from 'react';
import {
  useTable,
  useSortBy,
  useResizeColumns,
  useFlexLayout,
  Column,
  TableInstance,
  CellProps,
  useBlockLayout,
} from 'react-table';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { useNavigate } from 'react-router-dom';
import './GridView.css';

interface Data {
  firstName: string;
  lastName: string;
  email: string;
  [key: string]: any; // Allows for dynamic fields of any type
}

interface GridViewProps {
  columns: Column<Data>[];
  data: Data[];
  updateMyData: (rowIndex: number, columnId: string, value: string) => void;
  setColumns?: React.Dispatch<React.SetStateAction<Column<Data>[]>>;
}

const DraggableHeader: React.FC<{
  column: any;
  index: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
}> = ({ column, index, moveColumn }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: 'column',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveColumn(item.index, index);
        item.index = index;
      }
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: 'column',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {column.render('Header')}
      <div
        {...column.getResizerProps()}
        className="resizer"
        onMouseDown={(e) => e.preventDefault()}
      />
    </div>
  );
};

const EditableCell: React.FC<CellProps<Data> & { updateMyData: (rowIndex: number, columnId: string, value: string) => void }> = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData,
}) => {
  const [value, setValue] = useState(initialValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    updateMyData(index, id, value);
  };

  return <input value={value} onChange={onChange} onBlur={onBlur} />;
};


const GridView: React.FC<GridViewProps> = ({ columns, data, updateMyData, setColumns }) => {
  const navigate = useNavigate();

  const defaultColumn: Partial<Column<Data>> = {
    Cell: (props: CellProps<Data>) => <EditableCell {...props} updateMyData={updateMyData} />,
    minWidth: 30,
    width: 150,
    maxWidth: 400,
  };

  const moveColumn = (dragIndex: number, hoverIndex: number) => {
    if (setColumns) {
      const draggedColumn = columns[dragIndex];
      setColumns(update(columns, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, draggedColumn],
        ],
      }));
    }
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<Data>(
    {
      columns,
      data,
      defaultColumn,
    },
    useSortBy,
    useBlockLayout,
    useResizeColumns,
    useFlexLayout,
  ) as TableInstance<Data>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '10px 20px',
            marginBottom: '20px',
            backgroundColor: '#007bff',
            border: 'none',
            borderRadius: '5px',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          Back to Dashboard
        </button>
        <table {...getTableProps()} style={{ width: '100%' }}>
          <thead>
            {headerGroups.map((headerGroup, headerGroupIndex) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={`header-group-${headerGroupIndex}`}>
                {headerGroup.headers.map((column, columnIndex) => (
                  <th
                    {...column.getHeaderProps()}
                    key={`column-${columnIndex}`}
                    style={{
                      padding: '10px',
                      border: '1px solid black',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <DraggableHeader column={column} index={columnIndex} moveColumn={moveColumn} />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={`row-${rowIndex}`}>
                  {row.cells.map((cell, cellIndex) => (
                    <td
                      {...cell.getCellProps()}
                      key={`cell-${rowIndex}-${cellIndex}`}
                      style={{
                        padding: '10px',
                        border: '1px solid black',
                        overflow: 'hidden',
                      }}
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DndProvider>
  );
};

export default GridView;

