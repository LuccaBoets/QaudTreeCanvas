const selectQaudtreeMethode = new mdc.select.MDCSelect(document.getElementById('selectQaudtreeMethode'));
selectQaudtreeMethode.selectedIndex = 0;
selectQaudtreeMethode.listen('MDCSelect:change', () => {
    console.log(`Selected option at index ${selectQaudtreeMethode.selectedIndex} with value "${selectQaudtreeMethode.value}"`);
});

const selectColorMode = new mdc.select.MDCSelect(document.getElementById('selectColorMode'));
selectColorMode.selectedIndex = 0;
selectColorMode.listen('MDCSelect:change', () => {
    console.log(`Selected option at index ${selectColorMode.selectedIndex} with value "${selectColorMode.value}"`);
});

const snackbar = new mdc.snackbar.MDCSnackbar(document.getElementById('snackbar'));
snackbar.timeoutMs = 4000;
