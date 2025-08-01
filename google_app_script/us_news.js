function fillUSD() {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Define CPI dates in MM/DD/YYYY format
    const cpiDates = [
        '12/10/2025',
        '11/13/2025',
        '10/15/2025',
        '09/11/2025',
        '08/12/2025',
        '07/15/2025', // July CPI
        '06/11/2025', // June CPI
        '05/13/2025', // May CPI
        '04/10/2025', // April CPI
        '03/12/2025', // March CPI
        '02/12/2025', // February CPI
        '01/15/2025'  // January CPI
    ];

    // Find column indices
    const headers = data[0];
    const usdColIndex = headers.findIndex(header => header.toString().includes('USD'));
    const dateColIndex = headers.findIndex(header => header.toString().toLowerCase().includes('date'));
    
    // Validate columns exist
    if (usdColIndex === -1 || dateColIndex === -1) {
        Logger.log('Required columns not found');
        return;
    }

    // Process each row
    let cpiFound = 0;
    
    data.forEach((row, rowIndex) => {
        if (rowIndex === 0) return; // Skip header row
        
        const rowDate = row[dateColIndex];
        if (!rowDate) return;
        
        // Format date to MM/DD/YYYY
        const date = new Date(rowDate);
        const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
        
        const range = sheet.getRange(rowIndex + 1, usdColIndex + 1);
        
        // Check for CPI dates
        if (cpiDates.includes(formattedDate)) {
            range.setValue('CPI');
            cpiFound++;
        }
    });

    Logger.log(`Filled ${cpiFound} CPI dates`);
}

// Update menu to show only USD function
function onOpen() {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Custom Actions')
        .addItem('Fill USD CPI', 'fillUSD')
        .addToUi();
}