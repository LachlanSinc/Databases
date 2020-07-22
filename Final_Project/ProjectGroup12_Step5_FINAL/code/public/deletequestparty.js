function deleteQuestParty(id1, id2){
    $.ajax({
        url: '/quest-party/' + id1 +'/'+id2,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};

