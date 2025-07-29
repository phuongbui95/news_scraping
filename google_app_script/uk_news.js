function fillGBPHolidays() {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Define holiday dates in MM/DD/YYYY format
    const holidayDates = [
        '05/26/2025', // Spring Bank Holiday
        '05/05/2025', // May Day
        '04/21/2025', // Easter Monday
        '04/18/2025', // Good Friday
        '01/01/2025'  // New Year's Day
    ];

    // Find column indices
    const headers = data[0];
    const gbpColIndex = headers.findIndex(header => header.toString().includes('GBP'));
    const dateColIndex = headers.findIndex(header => header.toString().toLowerCase().includes('date'));
    
    // Validate columns exist
    if (gbpColIndex === -1 || dateColIndex === -1) {
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
            const range = sheet.getRange(rowIndex + 1, gbpColIndex + 1);
            range.setValue('Holiday');
            holidaysFound++;
        }
    });

    Logger.log(`Filled ${holidaysFound} GBP holidays`);
}

// Update menu to show only GBP holiday function
function onOpen() {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Custom Actions')
        .addItem('Fill GBP Holidays', 'fillGBPHolidays')
        .addToUi();
}