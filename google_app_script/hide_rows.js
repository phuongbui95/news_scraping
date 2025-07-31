function hideEmptyRows() {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Find currency and date column indices
    const headers = data[0];
    const currencyColumns = {
        usd: headers.findIndex(header => header.toString().includes('USD')),
        eur: headers.findIndex(header => header.toString().includes('EUR')),
        gbp: headers.findIndex(header => header.toString().includes('GBP')),
        jpy: headers.findIndex(header => header.toString().includes('JPY'))
    };
    const dateColIndex = headers.findIndex(header => 
        header.toString().toLowerCase().includes('date')
    );
    
    // Validate that required columns exist
    if (Object.values(currencyColumns).every(index => index === -1) || dateColIndex === -1) {
        Logger.log('Required columns not found');
        return;
    }
    
    // Track rows to hide
    let hiddenCount = 0;
    
    // Check each row (skip header)
    for (let rowIndex = 1; rowIndex < data.length; rowIndex++) {
        const rowDate = new Date(data[rowIndex][dateColIndex]);
        const isYear2025 = rowDate.getFullYear() === 2025;
        
        // Check if all currency cells in this row are empty and date is in 2025
        const isEmpty = Object.values(currencyColumns)
            .filter(colIndex => colIndex !== -1) // Only check columns that exist
            .every(colIndex => {
                const cellValue = data[rowIndex][colIndex];
                return !cellValue || cellValue.toString().trim() === '';
            });
        
        if (isEmpty && isYear2025) {
            // Hide the row (+1 because sheet rows are 1-based)
            sheet.hideRows(rowIndex + 1);
            hiddenCount++;
        }
    }
    
    Logger.log(`Hidden ${hiddenCount} rows with empty currency values in 2025`);
}

// Add menu item to run the script
function onOpen() {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Custom Actions')
        .addItem('Hide Empty Currency Rows', 'hideEmptyRows')
        .addToUi();
}