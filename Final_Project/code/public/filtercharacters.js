function filterCharactersParty() {
    //get the id of the selected homeworld from the filter dropdown
    var party_id = document.getElementById('party_filter').value
    //construct the URL and redirect to it
    window.location = '/characters/filter/' + parseInt(party_id)
}
