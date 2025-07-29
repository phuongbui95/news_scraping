function fillJPYHolidays() {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    // Define holiday dates in MM/DD/YYYY format
    const holidayDates = [
        '07/21/2025',
        '05/06/2025',
        '05/05/2025',
        '04/29/2025',
        '03/20/2025',
        '02/24/2025',
        '02/11/2025',
        '01/13/2025',
        '01/03/2025',
        '01/02/2025',
        '01/01/2025'
    ];

    // Find column indices
    const headers = data[0];
    const jpyColIndex = headers.findIndex(header => header.toString().includes('JPY'));
    const dateColIndex = headers.findIndex(header => header.toString().toLowerCase().includes('date'));
    
    // Validate columns exist
    if (jpyColIndex === -1 || dateColIndex === -1) {
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
            const range = sheet.getRange(rowIndex + 1, jpyColIndex + 1);
            range.setValue('Holiday');
            holidaysFound++;
        }
    });

    Logger.log(`Filled ${holidaysFound} JPY holidays`);
}

// Update menu to show only JPY holiday function
function onOpen() {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('Custom Actions')
        .addItem('Fill JPY Holidays', 'fillJPYHolidays')
        .addToUi();
}