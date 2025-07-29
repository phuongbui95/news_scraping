function fillUSDHolidays() {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Define holiday dates in MM/DD/YYYY format
    const holidayDates = [
        '07/04/2025', // Independence Day
        '06/19/2025', // Juneteenth
        '05/26/2025', // Memorial Day
        '02/17/2025', // Presidents' Day
        '01/20/2025', // Martin Luther King Jr. Day
        '01/01/2025'  // New Year's Day
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
    let holidaysFound = 0;
    data.forEach((row, rowIndex) => {
        if (rowIndex === 0) return; // Skip header row
        
        const rowDate = row[dateColIndex];
        if (!rowDate) return;
        
        // Format date to MM/DD/YYYY
        const date = new Date(rowDate);
        const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
        
        // Only fill if date matches holiday list
        if (holidayDates.includes(formattedDate)) {
            const range = sheet.getRange(rowIndex + 1, usdColIndex + 1);
            range.setValue('Holiday');
            holidaysFound++;
        }
    });

    Logger.log(`Filled ${holidaysFound} USD holidays`);
}

// Update menu to show only USD holiday function
function onOpen() {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Custom Actions')
        .addItem('Fill USD Holidays', 'fillUSDHolidays')
        .addToUi();
}