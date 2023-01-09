var update_login_status = function (type,msg,hide = false) {
	
	switch (type) {		
		case "error":
			alert_type = "danger";
		break;
		
		case "success":
			alert_type = "success";
		break;
		case "info":
			alert_type = "info";
		break;
		default:
			alert_type = "info";
		break;
	}
	
	var html = "<div class = 'alert alert-"+alert_type+"'>"+msg+"</div>";
	$('#login_status').html(html);
	$('#login_status').show();
	if (hide) {
		setTimeout(function() {
			$('#login_status').slideUp();
			$('#login_status').html("");
		}, hide);
	}
}

$(document).on("submit", '.login_form', function(e) {
    var $form = $(this);
    var $input = $form.find(':submit');
    $input.attr("disabled", 'disabled');
 
    var dataz = $form.serializeArray();
    $.ajax({
        type: $form.attr('method'),
        url: $form.attr('action'),
        data: dataz,
        dataType: 'json',
        success: function(data) {
            if (data.redirect) {				
				setTimeout(function() {
					window.location.href = data.redirect;
				}, 3000);               
            }
				
            update_login_status (data.status,data.message,10000);
            if (data.view_captcha) {				
				$("#login_recaptcha").show();
            }
			if (data.reset) {
				$form.trigger('reset');
			}
            
        },
        error: function(request, x, y) {
            if (request.status == 422) {
                var errorsHtml = "";
                $.each(request.responseJSON.errors, function(key, value) {
                    errorsHtml += '' + value[0] + '<br/>';
                });
                update_login_status ("error",errorsHtml);
            } 
			else if (request.status == 419) {
				location.reload();
			}
			else {
                update_login_status ("error","Server Error .. ",5000);
            }
        },
        complete: function(data) {
            $input.removeAttr("disabled");
            if (typeof(grecaptcha) != 'undefined') {
                grecaptcha.reset();
            }
			if ('function' === typeof initRecapatcha)  {
				initRecapatcha();
			}
        },
        beforeSend: function() {
           update_login_status ("info","Loading ...");
        },
    });
    e.preventDefault();
});
