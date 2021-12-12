import styles from './table.module.css';
import Button from '../Button';

function Table(props) {
  console.log(props.data[0]);
  console.log('data:', props.data[0]);
  return (
    <table className={styles.tableData}>
      <thead className={styles.tableHeader}>
        <tr className={styles.trStyles}>
          {props.columns.map((column) => {
            return (
              <th key={column.name} className={styles.thStyles}>
                {column.name}
              </th>
            );
          })}
          {props.actions.length && <th className={styles.thStyles}>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {props.data.length === 0 ? (
          <tr>
            <td>
              <p>There is no data to show. Please create new entities.</p>
            </td>
          </tr>
        ) : (
          props.data.map((item) => {
            return (
              <tr key={item._id} onClick={() => props.onRowClick(item)} className={styles.trStyles}>
                {props.columns.map((column, index) => {
                  return (
                    <td key={`${item[column.value]}-${index}`} className={styles.tdStyles}>
                      {item[column.value]}
                    </td>
                  );
                })}
                <td className={styles.tdActions}>
                  {props.actions.map((action) => {
                    return (
                      <Button
                        key={action.text}
                        label={action.text}
                        style={styles.actionButton}
                        onClick={(e) => action.callback(e, item)}
                      />
                    );
                  })}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}

export default Table;
