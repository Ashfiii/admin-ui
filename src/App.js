import React, {useState, useEffect} from 'react';
import MaterialTable from 'material-table';
import './App.css';

function App() {
  const [dataRow, setDataRow] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const columns = [
    {title:"Name", field:"name"},
    {title:"Email", field:"email"},
    {title:"Role", field:"role"},
  ]

  useEffect(()=>{
    fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json")
    .then(res =>res.json())
    .then(res =>setDataRow(res))
  }, [])

  const handleBulkDelete = ()=>{
    const updatedData = dataRow.filter(row => !selectedRows.includes(row));
    setDataRow(updatedData);
  }

  return (
    <div className="app">
      <MaterialTable 
      columns={columns} 
      data={dataRow} 
      onSelectionChange={rows => setSelectedRows(rows)}
      editable={{
        onRowUpdate:(newRow, oldRow) => new Promise((resolve, reject) =>{
          const updatedData = [...dataRow];
          updatedData[oldRow.tableData.id]=newRow;
          setDataRow(updatedData);
          console.log(oldRow, newRow);
          setTimeout(()=> resolve(),500)
        }),
        onRowDelete:(selectedRow) => new Promise((resolve, reject) =>{
          const updatedData = [...dataRow];
          updatedData.splice(selectedRow.tableData.id, 1);
          setDataRow(updatedData);
          setTimeout(()=> resolve(),1000)
        })
      }}
      localization={{ toolbar: { searchPlaceholder: 'Search by name, email or role' } }}
      options={{headerStyle:{fontWeight:'bolder', fontSize: '18px'}, rowStyle:selectedRow => ({ backgroundColor: selectedRow.tableData.checked ? '#cfcccc' : '' }), searchFieldAlignment:"left", searchAutoFocus: true, searchFieldVariant: "outlined",selection: true,
      pageSizeOptions:[10,20,30,40,50], pageSize:10, paginationType: "stepped", actionsColumnIndex: -1}
      }
      actions={[
        {
          icon: ()=> <button class="btnDelete">Delete Selected</button>,
          onClick: ()=> handleBulkDelete()
        }
      ]}
      title=""/>
    </div>
  );
}

export default App;
