function updateParty(id){
    $.ajax({
        url: '/party/' + id,
        type: 'PUT',
        data: $('#update-party').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};