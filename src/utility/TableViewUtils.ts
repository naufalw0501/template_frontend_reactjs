class TableViewUtils {
    static FilterTable = (row: any, tableDataFilter: { [key: string]: string }) => {
      let keys = Object.keys(row);
      for (let indexKey = 0; indexKey < keys.length; indexKey++) {
        const key = keys[indexKey];
        if (tableDataFilter[key]) {
          if (row != undefined && row[key] != null) {
            if (tableDataFilter[key] !== "") {
              if (
                row[key]
                  .toString()
                  .toLowerCase()
                  .includes(tableDataFilter[key].toString().toLowerCase()) == false
              ) {
                return false;
              }
            }
          } else {
            return false;
          }
        }
      }
      return true;
    }
  
    static SortingTable = (a: any, b: any, sortChoosed: string): number => {
      if (sortChoosed != null && sortChoosed != undefined) {
        const valA = a[sortChoosed];
        const valB = b[sortChoosed];
    
        if (valA !== undefined && valB !== undefined) {
          // Handle string
          if (typeof valA === 'string' && typeof valB === 'string') {
            return valA.localeCompare(valB);
          }
    
          // Handle number
          if (typeof valA === 'number' && typeof valB === 'number') {
            return valA - valB;
          }
    
          // Handle Date
          if (valA instanceof Date && valB instanceof Date) {
            return valA.getTime() - valB.getTime();
          }
    
          // Handle if value is string that can be parsed to Date
          if (
            typeof valA === 'string' && typeof valB === 'string' &&
            !isNaN(Date.parse(valA)) && !isNaN(Date.parse(valB))
          ) {
            return new Date(valA).getTime() - new Date(valB).getTime();
          }
        }
      }
      
      return 0;
    }
    
  }
  
  export default TableViewUtils