function fillEURHolidays() {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Define holiday dates in MM/DD/YYYY format
    const holidayDates = [
        '07/14/2025', // French National Day
        '06/09/2025', // Whit Monday (French & German)
        '05/29/2025', // Ascension Day (French & German)
        '05/08/2025', // Victory Day (French)
        '05/01/2025', // Labor Day (French & German)
        '04/21/2025', // Easter Monday (French & German)
        '04/18/2025', // Good Friday (German)
        '01/01/2025'  // New Year's Day (French & German)
    ];

    // Find column indices
    const headers = data[0];
    const eurColIndex = headers.findIndex(header => header.toString().includes('EUR'));
    const dateColIndex = headers.findIndex(header => header.toString().toLowerCase().includes('date'));
    
    // Validate columns exist
    if (eurColIndex === -1 || dateColIndex === -1) {
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
            const range = sheet.getRange(rowIndex + 1, eurColIndex + 1);
            range.setValue('Holiday');
            holidaysFound++;
        }
    });

    Logger.log(`Filled ${holidaysFound} EUR holidays`);
}

// Update menu to show only EUR holiday function
function onOpen() {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Custom Actions')
        .addItem('Fill EUR Holidays', 'fillEURHolidays')
        .addToUi();
}