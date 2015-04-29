$(document).ready(function(){
	
    $("#envelopes tbody" ).on( "click", "#edit", function(event) {
            var that = this;
            $(this).find(':radio').prop("checked",true);
            loadData(that);
            $('#checkInModal').modal({                 
            });
    });

    function loadData(that){
        $('#editCategory').val($(that).parent().find('.category').html());
        $('#editAmount').val($(that).parent().find('.amount').html());
    }
    
    $('.btn-save').click(function(){
        // Update the new values inside the Table
        var row = $('input[name=select]:checked').parent().parent();        
        $(row).find('.category').html( $('#editCategory').val());
        $(row).find('.amount').html( $('#editAmount').val());
        $('#checkInModal').modal('hide');
        
        //Create an object with the saved values and post it to server
    });
	
	// For Debugging
	// $("#envelopes tbody").on("click", "tr", function(event){
		// alert($(this).text());
		// alert($(this).find('.category').html());
	// });
});