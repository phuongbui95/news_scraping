function isWeekend(dateString) {
    // Convert date string to Date object
    const date = new Date(dateString);
    
    // Get day of week (0 = Sunday, 6 = Saturday)
    const day = date.getDay();
    
    // Return true if Saturday or Sunday
    return day === 0 || day === 6;
}

function deleteRows() {
    const sheet = SpreadsheetApp.getActiveSheet() ;
    const data = sheet.getDataRange().getValues();
    
    // Find Date column index
    const headers = data[0];
    const dateColIndex = headers.findIndex(header => 
        header.toString().toLowerCase().includes('date')
    );
    
    // Validate Date column exists
    if (dateColIndex === -1) {
        Logger.log('Date column not found');
        return;
    }
    
    // Track rows to delete (in reverse order to avoid shifting issues)
    const rowsToDelete = [];
    
    // Check each row (skip header)
    for (let i = 1; i < data.length; i++) {
        const dateValue = data[i][dateColIndex];
        if (dateValue && isWeekend(dateValue)) {
            rowsToDelete.push(i + 1); // +1 because sheet rows are 1-based
        }
    }
    
    // Delete rows in reverse order
    for (let i = rowsToDelete.length - 1; i >= 0; i--) {
        sheet.deleteRow(rowsToDelete[i]);
    }
    
    Logger.log(`Deleted ${rowsToDelete.length} weekend rows`);
}

// // Update menu to show only deleteRows() function
// function onOpen() {
//     const ui = SpreadsheetApp.getUi();
//     ui.createMenu('Custom Actions')
//         .addItem('Delete Weekends', 'deleteRows()')
//         .addToUi();
// }