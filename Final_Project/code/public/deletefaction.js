function deleteFaction(id){
    $.ajax({
        url: '/factions/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

function deleteCharacter(id){
    $.ajax({
        url: '/characters/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};


function deleteParty(id){
    $.ajax({
        url: '/party/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

